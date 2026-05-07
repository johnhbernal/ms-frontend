import { useState, useEffect, useCallback } from 'react';
import { Alert, Badge, Button, Form, InputGroup, Spinner, Table } from 'react-bootstrap';
import { getParametros, buscarPorNombre, deleteParametro } from '../services/practicaService';
import ParametroModal from '../components/ParametroModal';

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
      setError(err.response?.data?.description || 'Error al cargar parámetros');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadParametros();
  }, [loadParametros]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = searchTerm.trim()
        ? await buscarPorNombre(searchTerm.trim())
        : await getParametros();
      setParametros(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.description || 'Error en la búsqueda');
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async (param) => {
    if (!window.confirm(`¿Desactivar el parámetro "${param.parameterName}"?`)) return;
    try {
      await deleteParametro(param.parameterCode);
      await loadParametros();
    } catch (err) {
      setError(err.response?.data?.description || 'Error al desactivar');
    }
  };

  const handleEdit = (param) => {
    setEditingParam(param);
    setShowModal(true);
  };

  const handleNew = () => {
    setEditingParam(null);
    setShowModal(true);
  };

  const handleSaved = () => {
    setShowModal(false);
    loadParametros();
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h4 style={{ margin: 0, color: '#1e3a5f', fontWeight: 700 }}>Parámetros del Sistema</h4>
        <Button onClick={handleNew} style={{ background: '#2563eb', border: 'none' }}>
          + Nuevo Parámetro
        </Button>
      </div>

      <Form onSubmit={handleSearch} style={{ marginBottom: '16px', maxWidth: '400px' }}>
        <InputGroup>
          <Form.Control
            type="text"
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button type="submit" variant="outline-primary">Buscar</Button>
        </InputGroup>
      </Form>

      {error && (
        <Alert variant="danger" className="py-2">
          {error}{' '}
          <Alert.Link onClick={loadParametros} style={{ cursor: 'pointer' }}>
            Reintentar
          </Alert.Link>
        </Alert>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <Spinner animation="border" style={{ color: '#2563eb' }} />
        </div>
      ) : parametros.length === 0 ? (
        <p style={{ color: '#6c757d', fontStyle: 'italic' }}>No se encontraron parámetros.</p>
      ) : (
        <div style={{ background: 'white', borderRadius: '8px', border: '1px solid #dee2e6', overflow: 'hidden' }}>
          <Table hover className="mb-0">
            <thead style={{ background: '#1e3a5f', color: 'white' }}>
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Valor</th>
                <th>Estado</th>
                <th style={{ textAlign: 'center' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {parametros.map((p) => (
                <tr key={p.parameterCode}>
                  <td style={{ color: '#6c757d' }}>{p.parameterCode}</td>
                  <td style={{ fontWeight: 500 }}>{p.parameterName}</td>
                  <td>{p.parameterCategory}</td>
                  <td>{p.value}</td>
                  <td>
                    {p.status === 'A' ? (
                      <Badge style={{ background: '#d1fae5', color: '#065f46', fontWeight: 600 }}>Activo</Badge>
                    ) : (
                      <Badge style={{ background: '#f3f4f6', color: '#6b7280', fontWeight: 600 }}>Inactivo</Badge>
                    )}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <Button
                      size="sm"
                      onClick={() => handleEdit(p)}
                      style={{ background: '#dbe4ff', color: '#1e3a5f', border: 'none', marginRight: '6px' }}
                    >
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleDeactivate(p)}
                      style={{ background: '#fee2e2', color: '#991b1b', border: 'none' }}
                    >
                      Desactivar
                    </Button>
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
