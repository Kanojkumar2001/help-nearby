// Dummy auth module — no real backend, stores state in localStorage

export interface User {
  email: string;
  name: string;
  loggedInAt: string;
}

const AUTH_KEY = "emergency_locator_user";

export const getUser = (): User | null => {
  const raw = localStorage.getItem(AUTH_KEY);
  return raw ? JSON.parse(raw) : null;
};

export const loginUser = (email: string, name: string): User => {
  const user: User = { email, name, loggedInAt: new Date().toISOString() };
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  return user;
};

export const logoutUser = () => {
  localStorage.removeItem(AUTH_KEY);
};

// Dummy OTP — always "123456"
export const DUMMY_OTP = "123456";
