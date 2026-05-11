import { useState, useEffect, useCallback } from 'react';
import { Alert, Badge, Button, Form, Spinner, Table } from 'react-bootstrap';
import { getParametros, buscarPorNombre, deleteParametro } from '../services/practicaService';
import ParametroModal from '../components/ParametroModal';

const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const EmptyIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--slate-300)' }}>
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);

const EditIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const OffIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
  </svg>
);

function StatusBadge({ status }) {
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
      {active ? 'Activo' : 'Inactivo'}
    </span>
  );
}

function ActionButton({ onClick, icon, label, danger }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
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

function ParametrosPage() {
  const [parametros, setParametros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingParam, setEditingParam] = useState(null);

  const loadParametros = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getParametros();
      setParametros(res.data.data || []);
    } catch (err) {
      setError(safeErr(err, 'Error al cargar parámetros'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadParametros(); }, [loadParametros]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    const trimmed = searchTerm.trim();
    if (trimmed.length > 50) {
      setError('El término de búsqueda no puede superar 50 caracteres');
      return;
    }
    setLoading(true);
    try {
      const res = trimmed
        ? await buscarPorNombre(trimmed)
        : await getParametros();
      setParametros(res.data.data || []);
    } catch (err) {
      setError(safeErr(err, 'Error en la búsqueda'));
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async (param) => {
    if (!window.confirm(`¿Desactivar "${param.parameterName}"?`)) return;
    try {
      await deleteParametro(param.parameterCode);
      await loadParametros();
    } catch (err) {
      setError(safeErr(err, 'Error al desactivar'));
    }
  };

  const handleEdit = (param) => { setEditingParam(param); setShowModal(true); };
  const handleNew  = ()      => { setEditingParam(null);  setShowModal(true); };
  const handleSaved = ()     => { setShowModal(false); loadParametros(); };

  return (
    <>
      {/* ── Header ─────────────────────────────────────────── */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
      }}>
        <div>
          <h4 style={{ margin: '0 0 3px', color: 'var(--slate-900)', fontWeight: 700, fontSize: '1.15rem', letterSpacing: '-0.02em' }}>
            Parámetros del Sistema
          </h4>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--slate-500)' }}>
            {loading ? 'Cargando…' : `${parametros.length} parámetro${parametros.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <Button
          variant="primary"
          onClick={handleNew}
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <PlusIcon /> Nuevo Parámetro
        </Button>
      </div>

      {/* ── Search ─────────────────────────────────────────── */}
      <Form onSubmit={handleSearch} style={{ marginBottom: 16 }}>
        <div style={{ position: 'relative', maxWidth: 340 }}>
          <span style={{
            position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)',
            color: 'var(--slate-400)', display: 'flex', pointerEvents: 'none',
          }}>
            <SearchIcon />
          </span>
          <Form.Control
            type="text"
            placeholder="Buscar por nombre…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '2.2rem' }}
          />
        </div>
      </Form>

      {/* ── Error ──────────────────────────────────────────── */}
      {error && (
        <Alert variant="danger" className="mb-3">
          {error}{' '}
          <Alert.Link onClick={loadParametros} style={{ cursor: 'pointer' }}>Reintentar</Alert.Link>
        </Alert>
      )}

      {/* ── Content ────────────────────────────────────────── */}
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
            Sin parámetros
          </p>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--slate-400)' }}>
            {searchTerm ? 'No hay resultados para esa búsqueda.' : 'Crea el primer parámetro.'}
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
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Valor</th>
                <th style={{ width: 100 }}>Estado</th>
                <th style={{ width: 140, textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {parametros.map((p, i) => (
                <tr key={p.parameterCode}>
                  <td style={{ color: 'var(--slate-400)', fontVariantNumeric: 'tabular-nums' }}>
                    {i + 1}
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
                      {p.parameterCategory}
                    </span>
                  </td>
                  <td style={{ color: 'var(--slate-600)', fontFamily: 'monospace', fontSize: 12 }}>
                    {p.value}
                  </td>
                  <td><StatusBadge status={p.status} /></td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                      <ActionButton onClick={() => handleEdit(p)} icon={<EditIcon />} label="Editar" />
                      <ActionButton onClick={() => handleDeactivate(p)} icon={<OffIcon />} label="Desactivar" danger />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
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
