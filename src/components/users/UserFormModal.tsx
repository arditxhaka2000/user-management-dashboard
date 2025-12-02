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
  const [touched, setTouched] = useState<Partial<Record<keyof FormState, boolean>>>({});

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
    setTouched({});
  }, [editingUser, open]);

  const validate = (): boolean => {
    const next: Partial<FormState> = {};
    
    if (!form.first_name.trim()) {
      next.first_name = 'First name is required';
    } else if (form.first_name.length < 2) {
      next.first_name = 'First name must be at least 2 characters';
    }
    
    if (!form.last_name.trim()) {
      next.last_name = 'Last name is required';
    } else if (form.last_name.length < 2) {
      next.last_name = 'Last name must be at least 2 characters';
    }
    
    if (!form.email.trim()) {
      next.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = 'Please enter a valid email address';
    }
    
    if (!form.gender.trim()) {
      next.gender = 'Gender is required';
    }
    
    if (!form.ip_address.trim()) {
      next.ip_address = 'IP address is required';
    } else if (!/^(\d{1,3}\.){3}\d{1,3}$/.test(form.ip_address)) {
      next.ip_address = 'Please enter a valid IP address (e.g., 192.168.1.1)';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleBlur = (key: keyof FormState) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
    validate();
  };

  const handleChange = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (touched[key]) {
      validate();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({
      first_name: true,
      last_name: true,
      email: true,
      gender: true,
      ip_address: true,
    });

    if (!validate()) return;

    if (editingUser) {
      updateUser(editingUser.id, form);
      notify('User updated successfully', 'success');
    } else {
      addUser({
        id: crypto.randomUUID(),
        ...form,
      });
      notify('User created successfully', 'success');
    }

    onClose();
  };

  const formFields: Array<{
    key: keyof FormState;
    label: string;
    type: string;
    placeholder: string;
    icon: JSX.Element;
  }> = [
    {
      key: 'first_name',
      label: 'First Name',
      type: 'text',
      placeholder: 'John',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      key: 'last_name',
      label: 'Last Name',
      type: 'text',
      placeholder: 'Doe',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      key: 'email',
      label: 'Email Address',
      type: 'email',
      placeholder: 'john.doe@example.com',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      key: 'ip_address',
      label: 'IP Address',
      type: 'text',
      placeholder: '192.168.1.1',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      ),
    },
  ];

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editingUser ? 'Edit User' : 'Add New User'}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {formFields.map((field) => (
          <div key={field.key} className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              {field.label}
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                {field.icon}
              </div>
              <input
                type={field.type}
                value={form[field.key] ?? ''}
                onChange={(e) => handleChange(field.key, e.target.value)}
                onBlur={() => handleBlur(field.key)}
                placeholder={field.placeholder}
                className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 ${
                  touched[field.key] && errors[field.key]
                    ? 'border-rose-500 focus:border-rose-500'
                    : 'border-[rgb(var(--card-border))] focus:border-[rgb(var(--accent))]'
                } bg-white dark:bg-slate-800 text-sm transition-all duration-200`}
              />
            </div>
            {touched[field.key] && errors[field.key] && (
              <div className="flex items-center gap-2 text-xs text-rose-500 animate-fade-in">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errors[field.key]}
              </div>
            )}
          </div>
        ))}

        {/* Gender dropdown */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Gender
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <select
              value={form.gender ?? ''}
              onChange={(e) => handleChange('gender', e.target.value)}
              onBlur={() => handleBlur('gender')}
              className={`appearance-none w-full pl-12 pr-10 py-3 rounded-xl border-2 ${
                touched.gender && errors.gender
                  ? 'border-rose-500 focus:border-rose-500'
                  : 'border-[rgb(var(--card-border))] focus:border-[rgb(var(--accent))]'
              } bg-white dark:bg-slate-800 text-sm transition-all duration-200 cursor-pointer`}
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Non-binary">Non-binary</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          {touched.gender && errors.gender && (
            <div className="flex items-center gap-2 text-xs text-rose-500 animate-fade-in">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {errors.gender}
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t-2 border-[rgb(var(--card-border))]">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border-2 border-[rgb(var(--card-border))] text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[rgb(var(--accent))] to-[rgb(var(--accent-hover))] text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {editingUser ? 'Save Changes' : 'Create User'}
          </button>
        </div>
      </form>
    </Modal>
  );
}