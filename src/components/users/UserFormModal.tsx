import { useEffect, useState } from 'react';
import type { User } from '../../types';
import { Modal } from '../common/Modal';
import { useUserStore } from '../../store/userStore';
import { useToast } from '../common/Toast';

interface UserFormModalProps {
  open: boolean;
  onClose: () => void;
  editingUser?: User | null;
}

interface FormState {
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  ip_address: string;
}

const EMPTY_FORM: FormState = {
  first_name: '',
  last_name: '',
  email: '',
  gender: '',
  ip_address: '',
};

export function UserFormModal({
  open,
  onClose,
  editingUser,
}: UserFormModalProps) {

  const { addUser, updateUser } = useUserStore();
  const { notify } = useToast();

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<FormState>>({});

  useEffect(() => {
    setForm(
      editingUser
        ? {
          first_name: editingUser.first_name ?? '',
          last_name: editingUser.last_name ?? '',
          email: editingUser.email ?? '',
          gender: editingUser.gender ?? '',
          ip_address: editingUser.ip_address ?? '',
        }
        : EMPTY_FORM
    );
    setErrors({});
  }, [editingUser, open]);

  const validate = (): boolean => {
    const next: Partial<FormState> = {};
    if (!form.first_name.trim()) next.first_name = 'First name is required';
    if (!form.last_name.trim()) next.last_name = 'Last name is required';
    if (!form.email.trim()) next.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = 'Invalid email format';
    }
    if (!form.gender.trim()) next.gender = 'Gender is required';
    if (!form.ip_address.trim()) next.ip_address = 'IP address is required';

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (editingUser) {
      updateUser(editingUser.id, form);
      notify('User updated', 'success');
    } else {
      addUser({
        id: crypto.randomUUID(),
        ...form,
      });
      notify('User created', 'success');
    }

    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editingUser ? 'Edit user' : 'Add new user'}
    >
      <form onSubmit={handleSubmit} className="space-y-3">
        {(
          ['first_name', 'last_name', 'email', 'gender', 'ip_address'] as (keyof FormState)[]
        ).map((key) => {
          const label = key
            .toString()
            .replace('_', ' ')
            .replace(/\b\w/g, (c) => c.toUpperCase());

          return (
            <div key={key} className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                {label}
              </label>
              <input
                type={key === 'email' ? 'email' : 'text'}
                value={form[key] ?? ''}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, [key]: e.target.value }))
                }
                className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm"
              />
              {errors[key] && (
                <span className="text-xs text-rose-500">{errors[key]}</span>
              )}
            </div>
          );
        })}


        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-2 rounded-full border border-slate-300 dark:border-slate-600 text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium"
          >
            {editingUser ? 'Save changes' : 'Create user'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
