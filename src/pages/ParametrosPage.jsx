import { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Button, Form, Spinner, Table } from 'react-bootstrap';
import { getParametros, buscarPorNombre, deleteParametro } from '../services/practicaService';
import ParametroModal from '../components/ParametroModal';
import { downloadCsv } from '../utils/exportCsv';

const PAGE_SIZES = [5, 10, 25, 50];

const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const ExportIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const EmptyIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--slate-300)' }} aria-hidden="true">
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);

const EditIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const OffIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
  </svg>
);

function StatusBadge({ status }) {
  const { t } = useTranslation();
  const active = status === 'A';
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      padding: '3px 9px',
      borderRadius: 99,
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '0.02em',
      background: active ? 'var(--green-100)' : 'var(--slate-100)',
      color: active ? 'var(--green-700)' : 'var(--slate-500)',
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: '50%',
        background: active ? 'var(--green-700)' : 'var(--slate-400)',
      }} />
      {active ? t('parameters.active') : t('parameters.inactive')}
    </span>
  );
}

function ActionButton({ onClick, icon, label, danger }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding: '4px 10px',
        borderRadius: 'var(--radius-xs)',
        border: `1px solid ${hovered
          ? (danger ? 'var(--red-600)' : 'var(--blue-600)')
          : 'var(--slate-200)'}`,
        background: hovered
          ? (danger ? 'var(--red-50)' : 'var(--blue-50)')
          : 'white',
        color: hovered
          ? (danger ? 'var(--red-600)' : 'var(--blue-600)')
          : 'var(--slate-600)',
        fontSize: 12,
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'all var(--t-fast)',
      }}
    >
      {icon}
      {label}
    </button>
  );
}

const safeErr = (err, msg) =>
  err.response?.status < 500 ? err.response?.data?.description || msg : msg;

/** OWASP A02/A04 — never render master-token / secret-like values in clear text */
export function displayParamValue(name, value, hiddenLabel = '•••••••• (hidden)') {
  const n = (name || '').toUpperCase();
  if (n.startsWith('MASTER_TOKEN') || n.includes('SECRET') || n.includes('PASSWORD') || n.includes('API_KEY')) {
    return hiddenLabel;
  }
  return value ?? '';
}

function ParametrosPage() {
  const { t } = useTranslation();
  const [parametros, setParametros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingParam, setEditingParam] = useState(null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);

  const loadParametros = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getParametros();
      setParametros(res.data.data || []);
      setPage(0);
    } catch (err) {
      setError(safeErr(err, t('parameters.loadError')));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => { loadParametros(); }, [loadParametros]);

  const totalPages = Math.max(1, Math.ceil(parametros.length / pageSize));
  const safePage = Math.min(page, totalPages - 1);

  const pageRows = useMemo(() => {
    const start = safePage * pageSize;
    return parametros.slice(start, start + pageSize);
  }, [parametros, safePage, pageSize]);

  useEffect(() => {
    if (page !== safePage) setPage(safePage);
  }, [page, safePage]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    const trimmed = searchTerm.trim();
    if (trimmed.length > 50) {
      setError(t('parameters.searchTooLong'));
      return;
    }
    if (trimmed.length > 0 && !/^[a-zA-Z0-9_\-\s]+$/.test(trimmed)) {
      setError(t('parameters.searchInvalid'));
      return;
    }
    setLoading(true);
    try {
      const res = trimmed
        ? await buscarPorNombre(trimmed)
        : await getParametros();
      setParametros(res.data.data || []);
      setPage(0);
    } catch (err) {
      setError(safeErr(err, t('parameters.searchError')));
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async (param) => {
    if (!window.confirm(t('parameters.deactivateConfirm', { name: param.parameterName }))) return;
    try {
      await deleteParametro(param.parameterCode);
      await loadParametros();
    } catch (err) {
      setError(safeErr(err, t('parameters.deactivateError')));
    }
  };

  const handleEdit = (param) => { setEditingParam(param); setShowModal(true); };
  const handleNew = () => { setEditingParam(null); setShowModal(true); };
  const handleSaved = () => { setShowModal(false); loadParametros(); };

  const handleExport = (format) => {
    if (parametros.length === 0) {
      setError(t('parameters.exportEmpty'));
      return;
    }
    const headers = ['#', t('parameters.csvName'), t('parameters.csvCategory'), t('parameters.csvValue'), t('parameters.csvStatus')];
    const rows = parametros.map((p, i) => [
      i + 1,
      p.parameterName,
      p.parameterCategory || '',
      displayParamValue(p.parameterName, p.value, t('parameters.hiddenValue')),
      p.status === 'A' ? t('parameters.active') : t('parameters.inactive'),
    ]);
    const stamp = new Date().toISOString().slice(0, 10);
    const ext = format === 'excel' ? 'csv' : 'csv';
    const name = format === 'excel'
      ? `parametros-excel-${stamp}.${ext}`
      : `parametros-${stamp}.${ext}`;
    downloadCsv(name, headers, rows);
  };

  const from = parametros.length === 0 ? 0 : safePage * pageSize + 1;
  const to = Math.min((safePage + 1) * pageSize, parametros.length);

  return (
    <>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
        gap: 12,
        flexWrap: 'wrap',
      }}>
        <div>
          <h4 style={{ margin: '0 0 3px', color: 'var(--slate-900)', fontWeight: 700, fontSize: '1.15rem', letterSpacing: '-0.02em' }}>
            {t('parameters.title')}
          </h4>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--slate-500)' }} data-testid="parametros-count">
            {loading
              ? t('parameters.loadingCount')
              : t('parameters.count', { count: parametros.length })}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Button
            variant="outline-secondary"
            onClick={() => handleExport('csv')}
            disabled={loading || parametros.length === 0}
            data-testid="export-csv"
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <ExportIcon /> {t('parameters.exportCsv')}
          </Button>
          <Button
            variant="outline-secondary"
            onClick={() => handleExport('excel')}
            disabled={loading || parametros.length === 0}
            data-testid="export-excel"
            title={t('parameters.exportExcelTitle')}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <ExportIcon /> {t('parameters.exportExcel')}
          </Button>
          <Button
            variant="primary"
            onClick={handleNew}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <PlusIcon /> {t('parameters.create')}
          </Button>
        </div>
      </div>

      <Form onSubmit={handleSearch} style={{ marginBottom: 16 }} role="search">
        <label htmlFor="parametros-search" className="visually-hidden">{t('parameters.searchLabel')}</label>
        <div style={{ position: 'relative', maxWidth: 360 }}>
          <span
            style={{
              position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
              color: 'var(--slate-400)', display: 'flex', pointerEvents: 'none', zIndex: 1,
            }}
            aria-hidden="true"
          >
            <SearchIcon />
          </span>
          <Form.Control
            id="parametros-search"
            type="search"
            className="search-input-with-icon"
            placeholder={t('parameters.search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoComplete="off"
          />
        </div>
      </Form>

      {error && (
        <Alert variant="danger" className="mb-3">
          {error}{' '}
          <Alert.Link onClick={loadParametros} style={{ cursor: 'pointer' }}>{t('parameters.retry')}</Alert.Link>
        </Alert>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--blue-600)' }}>
          <Spinner animation="border" style={{ width: 28, height: 28 }} />
        </div>
      ) : parametros.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '4rem 2rem',
          background: 'white', borderRadius: 'var(--radius-md)',
          border: '1px solid var(--slate-100)',
          boxShadow: 'var(--shadow-xs)',
        }}>
          <EmptyIcon />
          <p style={{ margin: '12px 0 4px', fontWeight: 600, color: 'var(--slate-700)', fontSize: 14 }}>
            {t('parameters.empty')}
          </p>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--slate-400)' }}>
            {searchTerm ? t('parameters.emptySearch') : t('parameters.emptyCreate')}
          </p>
        </div>
      ) : (
        <div style={{
          background: 'white',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--slate-100)',
          boxShadow: 'var(--shadow-sm)',
          overflow: 'hidden',
        }}>
          <Table hover className="mb-0">
            <thead style={{ background: 'var(--slate-900)', color: 'white' }}>
              <tr>
                <th style={{ width: 48 }}>#</th>
                <th>{t('parameters.colName')}</th>
                <th>{t('parameters.colCategory')}</th>
                <th>{t('parameters.colValue')}</th>
                <th style={{ width: 100 }}>{t('parameters.colStatus')}</th>
                <th style={{ width: 140, textAlign: 'right' }}>{t('parameters.colActions')}</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((p, i) => (
                <tr key={p.parameterCode}>
                  <td style={{ color: 'var(--slate-400)', fontVariantNumeric: 'tabular-nums' }}>
                    {safePage * pageSize + i + 1}
                  </td>
                  <td style={{ fontWeight: 500, color: 'var(--slate-900)' }}>
                    {p.parameterName}
                  </td>
                  <td>
                    <span style={{
                      fontSize: 11, fontWeight: 600, color: 'var(--slate-500)',
                      background: 'var(--slate-100)', padding: '2px 7px',
                      borderRadius: 99, letterSpacing: '0.04em',
                    }}>
                      {p.parameterCategory || '—'}
                    </span>
                  </td>
                  <td style={{ color: 'var(--slate-600)', fontFamily: 'monospace', fontSize: 12 }}>
                    {displayParamValue(p.parameterName, p.value, t('parameters.hiddenValue'))}
                  </td>
                  <td><StatusBadge status={p.status} /></td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                      <ActionButton onClick={() => handleEdit(p)} icon={<EditIcon />} label={t('parameters.edit')} />
                      <ActionButton onClick={() => handleDeactivate(p)} icon={<OffIcon />} label={t('parameters.deactivate')} danger />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <div
            data-testid="parametros-paginator"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 12,
              padding: '12px 16px',
              borderTop: '1px solid var(--slate-100)',
              background: 'var(--slate-50)',
              fontSize: 13,
              color: 'var(--slate-600)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>{t('parameters.rowsPerPage')}</span>
              <Form.Select
                size="sm"
                value={pageSize}
                onChange={(e) => { setPageSize(Number(e.target.value)); setPage(0); }}
                style={{ width: 72 }}
                aria-label={t('parameters.rowsPerPage')}
                data-testid="page-size"
              >
                {PAGE_SIZES.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </Form.Select>
              <span data-testid="page-range">
                {t('parameters.range', { from, to, total: parametros.length })}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Button
                variant="outline-secondary"
                size="sm"
                disabled={safePage === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                data-testid="page-prev"
              >
                {t('parameters.prev')}
              </Button>
              <span data-testid="page-indicator">
                {t('parameters.pageOf', { page: safePage + 1, total: totalPages })}
              </span>
              <Button
                variant="outline-secondary"
                size="sm"
                disabled={safePage >= totalPages - 1}
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                data-testid="page-next"
              >
                {t('parameters.next')}
              </Button>
            </div>
          </div>
        </div>
      )}

      <ParametroModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSaved={handleSaved}
        parametro={editingParam}
      />
    </>
  );
}

export default ParametrosPage;
