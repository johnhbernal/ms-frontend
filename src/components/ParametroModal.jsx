import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';
import { createParametro, updateParametro } from '../services/practicaService';

const schema = yup.object({
  parameterName: yup.string().required('El nombre es obligatorio'),
  parameterCategory: yup.string().required('La categoría es obligatoria'),
  value: yup.string().required('El valor es obligatorio'),
  status: yup.string().required().oneOf(['A', 'I']),
});

function ParametroModal({ show, onHide, onSaved, parametro }) {
  const isEdit = !!parametro;
  const [apiError, setApiError] = useState('');
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (show) {
      setApiError('');
      reset(
        parametro
          ? {
              parameterName: parametro.parameterName,
              parameterCategory: parametro.parameterCategory,
              value: parametro.value,
              status: parametro.status,
            }
          : { parameterName: '', parameterCategory: '', value: '', status: 'A' }
      );
    }
  }, [show, parametro, reset]);

  const onSubmit = async (data) => {
    setSaving(true);
    setApiError('');
    try {
      if (isEdit) {
        await updateParametro(parametro.parameterCode, data);
      } else {
        await createParametro(data);
      }
      onSaved();
    } catch (err) {
      setApiError(err.response?.data?.description || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title style={{ color: '#1e3a5f', fontWeight: 700 }}>
          {isEdit ? 'Editar Parámetro' : 'Nuevo Parámetro'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form id="parametro-form" onSubmit={handleSubmit(onSubmit)}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Form.Group>
              <Form.Label>Nombre *</Form.Label>
              <Form.Control
                type="text"
                isInvalid={!!errors.parameterName}
                disabled={saving}
                {...register('parameterName')}
              />
              <Form.Control.Feedback type="invalid">
                {errors.parameterName?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group>
              <Form.Label>Categoría *</Form.Label>
              <Form.Control
                type="text"
                isInvalid={!!errors.parameterCategory}
                disabled={saving}
                {...register('parameterCategory')}
              />
              <Form.Control.Feedback type="invalid">
                {errors.parameterCategory?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group>
              <Form.Label>Valor *</Form.Label>
              <Form.Control
                type="text"
                isInvalid={!!errors.value}
                disabled={saving}
                {...register('value')}
              />
              <Form.Control.Feedback type="invalid">
                {errors.value?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group>
              <Form.Label>Estado</Form.Label>
              <Form.Select disabled={saving} {...register('status')}>
                <option value="A">Activo</option>
                <option value="I">Inactivo</option>
              </Form.Select>
            </Form.Group>
          </div>
          {apiError && (
            <Alert variant="danger" className="mt-3 py-2">{apiError}</Alert>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={saving}>
          Cancelar
        </Button>
        <Button
          type="submit"
          form="parametro-form"
          disabled={saving}
          style={{ background: '#2563eb', border: 'none' }}
        >
          {saving ? (
            <><Spinner size="sm" className="me-2" />Guardando...</>
          ) : (
            'Guardar'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ParametroModal;
