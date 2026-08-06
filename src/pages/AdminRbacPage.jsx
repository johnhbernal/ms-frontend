import { useCallback, useEffect, useState } from 'react';
import {
  Alert, Badge, Button, Form, Modal, Spinner, Tab, Tabs, Table,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import {
  listUsers, listGroups, listRoles, listPermissions,
  createGroup, createPermission, createRole,
  addGroupMember, removeGroupMember,
  assignRoleToGroup, assignPermissionToRole, removePermissionFromRole,
  adminResetPassword,
} from '../services/rbacService';

const PASSWORD_RULE = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/;

function UsersTab({ users, onRefresh }) {
  const { t } = useTranslation();
  const [modalUser, setModalUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!newPassword) { setErr(t('admin.passwordRequired')); return; }
    if (!PASSWORD_RULE.test(newPassword)) {
      setErr(t('admin.passwordRule'));
      return;
    }
    setLoading(true);
    setErr('');
    try {
      const res = await adminResetPassword(modalUser.id, newPassword);
      setMsg(res.message || t('common.success'));
      setNewPassword('');
      onRefresh();
    } catch (e) {
      setErr(e.response?.data?.description || t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {msg && <Alert variant="success" dismissible onClose={() => setMsg('')}>{msg}</Alert>}
      <Table hover responsive size="sm">
        <thead>
          <tr>
            <th>{t('admin.colUser')}</th>
            <th>{t('admin.colName')}</th>
            <th>{t('admin.colEmail')}</th>
            <th>{t('admin.colRole')}</th>
            <th>{t('admin.colStatus')}</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {(users || []).length === 0 && (
            <tr><td colSpan={6} className="text-muted">{t('admin.empty')}</td></tr>
          )}
          {(users || []).map((u) => (
            <tr key={u.id}>
              <td>{u.username}</td>
              <td>{u.fullName}</td>
              <td>{u.email}</td>
              <td><Badge bg="secondary">{u.role}</Badge></td>
              <td>{u.status === 'A' ? t('admin.active') : t('admin.inactive')}</td>
              <td>
                <Button size="sm" variant="outline-primary" onClick={() => { setModalUser(u); setErr(''); setNewPassword(''); }}>
                  {t('admin.resetPassword')}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={!!modalUser} onHide={() => setModalUser(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{t('admin.resetPassword')} — {modalUser?.username}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p style={{ fontSize: 13, color: 'var(--slate-500)' }}>{t('admin.resetHint')}</p>
          <Form.Group>
            <Form.Label>{t('admin.newPassword')}</Form.Label>
            <Form.Control type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </Form.Group>
          {err && <Alert variant="danger" className="mt-2 mb-0">{err}</Alert>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalUser(null)}>{t('admin.cancel')}</Button>
          <Button variant="primary" onClick={handleReset} disabled={loading}>
            {loading ? t('common.loading') : t('admin.save')}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

function GroupsTab({ groups, users, roles, onRefresh }) {
  const { t } = useTranslation();
  const [selectedId, setSelectedId] = useState('');
  const [addUserId, setAddUserId] = useState('');
  const [assignRole, setAssignRole] = useState('');
  const [newGroup, setNewGroup] = useState({ name: '', description: '', distinguishedName: '' });
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  const group = (groups || []).find((g) => String(g.id) === selectedId);

  const run = async (fn) => {
    setBusy(true);
    setErr('');
    try {
      await fn();
      setMsg(t('common.success'));
      onRefresh();
    } catch (e) {
      setErr(e.response?.data?.description || t('common.error'));
    } finally {
      setBusy(false);
    }
  };

  const handleCreate = () => run(async () => {
    await createGroup(newGroup);
    setNewGroup({ name: '', description: '', distinguishedName: '' });
  });

  const handleAddMember = () => {
    if (!selectedId || !addUserId) return;
    run(() => addGroupMember(Number(selectedId), Number(addUserId)));
  };

  const handleRemoveMember = (username) => {
    const user = (users || []).find((u) => u.username === username);
    if (!user || !selectedId) return;
    run(() => removeGroupMember(Number(selectedId), user.id));
  };

  const handleAssignRole = () => {
    if (!selectedId || !assignRole) return;
    run(() => assignRoleToGroup(Number(selectedId), assignRole));
  };

  return (
    <div>
      {msg && <Alert variant="success" dismissible onClose={() => setMsg('')}>{msg}</Alert>}
      {err && <Alert variant="danger" dismissible onClose={() => setErr('')}>{err}</Alert>}

      <div style={{ background: 'var(--slate-50)', borderRadius: 8, padding: 16, marginBottom: 20 }}>
        <h6>{t('admin.createGroup')}</h6>
        <div className="row g-2">
          <div className="col-md-3">
            <Form.Control placeholder={t('admin.colName')} value={newGroup.name}
              onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })} />
          </div>
          <div className="col-md-3">
            <Form.Control placeholder={t('admin.description')} value={newGroup.description}
              onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })} />
          </div>
          <div className="col-md-4">
            <Form.Control placeholder="CN=Grupo,OU=Practica,DC=demo,DC=local"
              value={newGroup.distinguishedName}
              onChange={(e) => setNewGroup({ ...newGroup, distinguishedName: e.target.value })} />
          </div>
          <div className="col-md-2">
            <Button className="w-100" onClick={handleCreate} disabled={busy}>{t('admin.create')}</Button>
          </div>
        </div>
      </div>

      <Form.Group className="mb-3">
        <Form.Label>{t('admin.selectGroup')}</Form.Label>
        <Form.Select value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
          <option value="">—</option>
          {(groups || []).map((g) => (
            <option key={g.id} value={g.id}>{g.name}</option>
          ))}
        </Form.Select>
      </Form.Group>

      {group && (
        <>
          <div className="mb-3">
            <strong>{t('admin.members')}:</strong>{' '}
            {(group.members || []).length === 0 && <span className="text-muted">—</span>}
            {(group.members || []).map((m) => (
              <Badge key={m} bg="info" className="me-1" style={{ cursor: 'pointer' }}
                onClick={() => handleRemoveMember(m)} title={t('admin.removeMember')}>
                {m} ×
              </Badge>
            ))}
          </div>
          <div className="d-flex gap-2 mb-3 flex-wrap">
            <Form.Select style={{ maxWidth: 220 }} value={addUserId} onChange={(e) => setAddUserId(e.target.value)}>
              <option value="">{t('admin.addUser')}</option>
              {(users || []).map((u) => (
                <option key={u.id} value={u.id}>{u.username}</option>
              ))}
            </Form.Select>
            <Button onClick={handleAddMember} disabled={busy || !addUserId}>{t('admin.add')}</Button>
          </div>

          <div className="mb-2"><strong>{t('admin.groupRoles')}:</strong> {(group.roles || []).join(', ') || '—'}</div>
          <div className="d-flex gap-2 flex-wrap">
            <Form.Select style={{ maxWidth: 220 }} value={assignRole} onChange={(e) => setAssignRole(e.target.value)}>
              <option value="">{t('admin.assignRole')}</option>
              {(roles || []).map((r) => (
                <option key={r.name} value={r.name}>{r.name}</option>
              ))}
            </Form.Select>
            <Button onClick={handleAssignRole} disabled={busy || !assignRole}>{t('admin.assignRole')}</Button>
          </div>
        </>
      )}
    </div>
  );
}

function RolesTab({ roles, permissions, onRefresh }) {
  const { t } = useTranslation();
  const [roleName, setRoleName] = useState('');
  const [permCode, setPermCode] = useState('');
  const [newRole, setNewRole] = useState({ name: '', description: '' });
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  const role = (roles || []).find((r) => r.name === roleName);

  const run = async (fn, okMsg) => {
    setBusy(true);
    setErr('');
    try {
      await fn();
      setMsg(okMsg);
      onRefresh();
    } catch (e) {
      setErr(e.response?.data?.description || t('common.error'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      {msg && <Alert variant="success" dismissible onClose={() => setMsg('')}>{msg}</Alert>}
      {err && <Alert variant="danger" dismissible onClose={() => setErr('')}>{err}</Alert>}

      <div style={{ background: 'var(--slate-50)', borderRadius: 8, padding: 16, marginBottom: 20 }}>
        <h6>{t('admin.createRole')}</h6>
        <div className="row g-2">
          <div className="col-md-3">
            <Form.Control placeholder="VENDEDOR" value={newRole.name}
              onChange={(e) => setNewRole({ ...newRole, name: e.target.value.toUpperCase() })} />
          </div>
          <div className="col-md-6">
            <Form.Control placeholder={t('admin.description')} value={newRole.description}
              onChange={(e) => setNewRole({ ...newRole, description: e.target.value })} />
          </div>
          <div className="col-md-3">
            <Button className="w-100" disabled={busy || !newRole.name}
              onClick={() => run(async () => {
                await createRole({ ...newRole, permissionCodes: [] });
                setNewRole({ name: '', description: '' });
              }, t('admin.roleCreated'))}>
              {t('admin.create')}
            </Button>
          </div>
        </div>
      </div>

      <div className="d-flex gap-2 mb-3 flex-wrap">
        <Form.Select style={{ maxWidth: 200 }} value={roleName} onChange={(e) => setRoleName(e.target.value)}>
          <option value="">{t('admin.tabRoles')}…</option>
          {(roles || []).map((r) => <option key={r.name} value={r.name}>{r.name}</option>)}
        </Form.Select>
        <Form.Select style={{ maxWidth: 280 }} value={permCode} onChange={(e) => setPermCode(e.target.value)}>
          <option value="">{t('admin.tabPermissions')}…</option>
          {(permissions || []).map((p) => (
            <option key={p.code} value={p.code}>{p.module ? `[${p.module}] ` : ''}{p.code}</option>
          ))}
        </Form.Select>
        <Button disabled={busy || !roleName || !permCode}
          onClick={() => run(() => assignPermissionToRole(roleName, permCode), t('admin.permAssigned'))}>
          {t('admin.assignPerm')}
        </Button>
        <Button variant="outline-danger" disabled={busy || !roleName || !permCode}
          onClick={() => run(() => removePermissionFromRole(roleName, permCode), t('admin.permRemoved'))}>
          {t('admin.removePerm')}
        </Button>
      </div>

      {role && (
        <div>
          <p><strong>{role.name}</strong> — {role.description}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {(role.permissions || []).map((p) => <Badge key={p} bg="dark">{p}</Badge>)}
          </div>
        </div>
      )}
    </div>
  );
}

function PermissionsTab({ permissions, onRefresh }) {
  const { t } = useTranslation();
  const [form, setForm] = useState({ code: '', description: '', module: 'INVENTARIO' });
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  const handleCreate = async () => {
    setBusy(true);
    setErr('');
    try {
      await createPermission({
        code: form.code.trim().toUpperCase(),
        description: form.description.trim(),
        module: form.module.trim().toUpperCase(),
      });
      setMsg(t('admin.permCreated'));
      setForm({ code: '', description: '', module: form.module });
      onRefresh();
    } catch (e) {
      setErr(e.response?.data?.description || t('common.error'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      {msg && <Alert variant="success" dismissible onClose={() => setMsg('')}>{msg}</Alert>}
      {err && <Alert variant="danger" dismissible onClose={() => setErr('')}>{err}</Alert>}

      <div style={{ background: 'var(--slate-50)', borderRadius: 8, padding: 16, marginBottom: 20 }}>
        <h6>{t('admin.createPermission')}</h6>
        <p className="small text-muted mb-2">{t('admin.moduleHint')}</p>
        <div className="row g-2">
          <div className="col-md-3">
            <Form.Control placeholder="INVENTARIO_PRECIO_READ" value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} />
          </div>
          <div className="col-md-2">
            <Form.Control placeholder="INVENTARIO" value={form.module}
              onChange={(e) => setForm({ ...form, module: e.target.value.toUpperCase() })} />
          </div>
          <div className="col-md-5">
            <Form.Control placeholder={t('admin.description')} value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="col-md-2">
            <Button className="w-100" onClick={handleCreate}
              disabled={busy || !form.code || !form.module || !form.description}>
              {t('admin.create')}
            </Button>
          </div>
        </div>
      </div>

      <Table hover responsive size="sm">
        <thead>
          <tr>
            <th>{t('admin.colModule')}</th>
            <th>{t('admin.colCode')}</th>
            <th>{t('admin.description')}</th>
          </tr>
        </thead>
        <tbody>
          {(permissions || []).length === 0 && (
            <tr><td colSpan={3} className="text-muted">{t('admin.empty')}</td></tr>
          )}
          {(permissions || []).map((p) => (
            <tr key={p.code}>
              <td><Badge bg="primary">{p.module || 'CORE'}</Badge></td>
              <td><code>{p.code}</code></td>
              <td>{p.description}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

function AdminRbacPage() {
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { t } = useTranslation();

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [u, g, r, p] = await Promise.all([
        listUsers(), listGroups(), listRoles(), listPermissions(),
      ]);
      setUsers(u);
      setGroups(g);
      setRoles(r);
      setPermissions(p);
    } catch (e) {
      setError(e.response?.data?.description || t('admin.loadError'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => { loadAll(); }, [loadAll]);

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
      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 4 }}>{t('admin.title')}</h2>
      <p style={{ color: 'var(--slate-500)', fontSize: 14, marginBottom: 20 }}>
        {t('admin.subtitle')}
      </p>

      {error && <Alert variant="danger">{error}</Alert>}

      <Tabs defaultActiveKey="users" className="mb-3">
        <Tab eventKey="users" title={t('admin.tabUsers')}>
          <UsersTab users={users} onRefresh={loadAll} />
        </Tab>
        <Tab eventKey="groups" title={t('admin.tabGroups')}>
          <GroupsTab groups={groups} users={users} roles={roles} onRefresh={loadAll} />
        </Tab>
        <Tab eventKey="roles" title={t('admin.tabRoles')}>
          <RolesTab roles={roles} permissions={permissions} onRefresh={loadAll} />
        </Tab>
        <Tab eventKey="permissions" title={t('admin.tabPermissions')}>
          <PermissionsTab permissions={permissions} onRefresh={loadAll} />
        </Tab>
      </Tabs>
    </div>
  );
}

export default AdminRbacPage;
