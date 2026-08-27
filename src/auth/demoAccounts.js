export const DEMO_ACCOUNTS = [
  { role: 'admin', email: 'admin@blooddono.demo', password: 'Demo123!' },
  { role: 'user', email: 'donor@blooddono.demo', password: 'Demo123!' },
];

export const isDemoAccount = (email) => DEMO_ACCOUNTS.some((acc) => acc.email === email);
