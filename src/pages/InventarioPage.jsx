import { useCallback, useEffect, useState } from 'react';
import { Alert, Badge, Button, Form, Spinner, Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { canSeeInventory, getJwtRole, hasPermission } from '../services/authService';
import {
  listInventoryProducts,
  updateInventoryPrice,
  updateInventoryStock,
} from '../services/rbacService';

function InventarioPage() {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const [drafts, setDrafts] = useState({});

  const canRead = canSeeInventory();
  const canWritePrice = getJwtRole() === 'ADMIN' || hasPermission('INVENTARIO_PRECIO_WRITE');
  const canWriteStock = getJwtRole() === 'ADMIN' || hasPermission('INVENTARIO_STOCK_WRITE');

  const load = useCallback(async () => {
    if (!canRead) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await listInventoryProducts();
      setProducts(data || []);
      const next = {};
      (data || []).forEach((p) => {
        next[p.sku] = { price: String(p.price), quantity: String(p.quantity) };
      });
      setDrafts(next);
    } catch (e) {
      setError(e.response?.data?.description || t('common.error'));
    } finally {
      setLoading(false);
    }
  }, [canRead, t]);

  useEffect(() => { load(); }, [load]);

  const savePrice = async (sku) => {
    setMsg('');
    setError('');
    try {
      await updateInventoryPrice(sku, Number(drafts[sku]?.price));
      setMsg(t('inventory.priceSaved'));
      load();
    } catch (e) {
      setError(e.response?.status === 403
        ? t('inventory.forbiddenWrite')
        : (e.response?.data?.description || t('common.error')));
    }
  };

  const saveStock = async (sku) => {
    setMsg('');
    setError('');
    try {
      await updateInventoryStock(sku, Number(drafts[sku]?.quantity));
      setMsg(t('inventory.stockSaved'));
      load();
    } catch (e) {
      setError(e.response?.status === 403
        ? t('inventory.forbiddenWrite')
        : (e.response?.data?.description || t('common.error')));
    }
  };

  if (!canRead) {
    return (
      <Alert variant="warning">
        {t('inventory.noAccess')}
        <div className="mt-2 small text-muted">{t('inventory.hintSeller')}</div>
      </Alert>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
        <div className="mt-2 text-muted">{t('common.loading')}</div>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 4 }}>{t('inventory.title')}</h2>
      <p style={{ color: 'var(--slate-500)', fontSize: 14, marginBottom: 16 }}>
        {t('inventory.subtitle')}
      </p>

      <div className="mb-3 d-flex flex-wrap gap-2">
        <Badge bg={canWritePrice ? 'success' : 'danger'}>
          INVENTARIO_PRECIO_WRITE: {canWritePrice ? t('inventory.badgeOk') : t('inventory.badgeDeny')}
        </Badge>
        <Badge bg={canWriteStock ? 'success' : 'danger'}>
          INVENTARIO_STOCK_WRITE: {canWriteStock ? t('inventory.badgeOk') : t('inventory.badgeDeny')}
        </Badge>
      </div>

      {msg && <Alert variant="success" dismissible onClose={() => setMsg('')}>{msg}</Alert>}
      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}

      <Table hover responsive size="sm">
        <thead>
          <tr>
            <th>SKU</th>
            <th>{t('inventory.name')}</th>
            <th>{t('inventory.price')}</th>
            <th>{t('inventory.stock')}</th>
            <th>{t('common.actions')}</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 && (
            <tr><td colSpan={5} className="text-muted">{t('inventory.empty')}</td></tr>
          )}
          {products.map((p) => (
            <tr key={p.sku}>
              <td><code>{p.sku}</code></td>
              <td>{p.name}</td>
              <td style={{ maxWidth: 140 }}>
                <Form.Control
                  size="sm"
                  type="number"
                  disabled={!canWritePrice}
                  value={drafts[p.sku]?.price ?? ''}
                  onChange={(e) => setDrafts({
                    ...drafts,
                    [p.sku]: { ...drafts[p.sku], price: e.target.value },
                  })}
                />
              </td>
              <td style={{ maxWidth: 120 }}>
                <Form.Control
                  size="sm"
                  type="number"
                  disabled={!canWriteStock}
                  value={drafts[p.sku]?.quantity ?? ''}
                  onChange={(e) => setDrafts({
                    ...drafts,
                    [p.sku]: { ...drafts[p.sku], quantity: e.target.value },
                  })}
                />
              </td>
              <td className="d-flex gap-1 flex-wrap">
                <Button size="sm" variant="outline-primary" disabled={!canWritePrice}
                  onClick={() => savePrice(p.sku)}>
                  {t('inventory.savePrice')}
                </Button>
                <Button size="sm" variant="outline-secondary" disabled={!canWriteStock}
                  onClick={() => saveStock(p.sku)}>
                  {t('inventory.saveStock')}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default InventarioPage;
