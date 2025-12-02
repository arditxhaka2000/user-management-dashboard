export type Gender = 'Male' | 'Female' | 'Non-binary' | string;

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  gender: Gender;
  ip_address: string;
}

export interface SortConfig {
  key: keyof User | null;
  direction: 'asc' | 'desc';
}
