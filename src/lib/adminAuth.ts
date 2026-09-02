// Admin authentication — simple credential-based, session stored in localStorage
// No email verification required. Hardcoded credentials checked client-side.
// For production, replace with a server-side verified admin token.

const ADMIN_EMAIL = "line@gmail.com";
const ADMIN_PASSWORD = "line123?";
const STORAGE_KEY = "line_admin_session";

export interface AdminSession {
  email: string;
  loggedInAt: string;
}

export function adminLogin(email: string, password: string): { success: boolean; error?: string } {
  if (email.toLowerCase().trim() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const session: AdminSession = {
      email: ADMIN_EMAIL,
      loggedInAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    return { success: true };
  }
  return { success: false, error: "Invalid email or password." };
}

export function adminLogout(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function getAdminSession(): AdminSession | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AdminSession;
  } catch {
    return null;
  }
}

export function isAdminLoggedIn(): boolean {
  return getAdminSession() !== null;
}
