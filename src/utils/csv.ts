// src/utils/csv.ts
import type { User } from '../types';

export async function fetchUsersFromCsv(
  url: string = '/data/mock_data.csv',
): Promise<User[]> {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Failed to load CSV: ${res.status} ${res.statusText}`);
  }

  const text = await res.text();

  // Very simple CSV parser assuming no commas inside fields.
  const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map((h) => h.trim());

  const users: User[] = lines.slice(1).map((line) => {
    const values = line.split(',').map((v) => v.trim());
    const row: Record<string, string> = {};
    headers.forEach((h, i) => {
      row[h] = values[i] ?? '';
    });

    return {
      id: String(row['id'] ?? ''),
      first_name: row['first_name'] ?? '',
      last_name: row['last_name'] ?? '',
      email: row['email'] ?? '',
      gender: row['gender'] ?? '',
      ip_address: row['ip_address'] ?? '',
    };
  });

  return users;
}
