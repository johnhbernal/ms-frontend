import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';
import { createParametro, updateParametro } from '../services/practicaService';

const schema = yup.object({
  parameterName:     yup.string().required('El nombre es obligatorio'),
  parameterCategory: yup.string().required('La categoría es obligatoria'),
  value:             yup.string().required('El valor es obligatorio'),
  status:            yup.string().required().oneOf(['A', 'I']),
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
              parameterName:     parametro.parameterName,
              parameterCategory: parametro.parameterCategory,
              value:             parametro.value,
              status:            parametro.status,
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
    <Modal show={show} onHide={onHide} centered size="sm">
      <Modal.Header closeButton style={{ padding: '18px 22px' }}>
        <Modal.Title style={{ fontSize: 15, fontWeight: 700, color: 'var(--slate-900)', letterSpacing: '-0.01em' }}>
          {isEdit ? 'Editar parámetro' : 'Nuevo parámetro'}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form id="parametro-form" onSubmit={handleSubmit(onSubmit)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            <Form.Group>
              <Form.Label>Nombre <span style={{ color: 'var(--red-600)' }}>*</span></Form.Label>
              <Form.Control
                type="text"
                placeholder="Ej. TIEMPO_SESION"
                isInvalid={!!errors.parameterName}
                disabled={saving}
                autoFocus
                {...register('parameterName')}
              />
              <Form.Control.Feedback type="invalid">
                {errors.parameterName?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group>
              <Form.Label>Categoría <span style={{ color: 'var(--red-600)' }}>*</span></Form.Label>
              <Form.Control
                type="text"
                placeholder="Ej. SISTEMA"
                isInvalid={!!errors.parameterCategory}
                disabled={saving}
                {...register('parameterCategory')}
              />
              <Form.Control.Feedback type="invalid">
                {errors.parameterCategory?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group>
              <Form.Label>Valor <span style={{ color: 'var(--red-600)' }}>*</span></Form.Label>
              <Form.Control
                type="text"
                placeholder="Ej. 3600"
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
            <Alert variant="danger" className="mt-4 mb-0">{apiError}</Alert>
          )}
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={saving}>
          Cancelar
        </Button>
        <Button variant="primary" type="submit" form="parametro-form" disabled={saving}>
          {saving ? (
            <><Spinner size="sm" animation="border" className="me-2" />Guardando…</>
          ) : (
            isEdit ? 'Guardar cambios' : 'Crear parámetro'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ParametroModal;
