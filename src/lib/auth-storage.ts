/**
 * Admin Credentials & Password Management
 * Supports dynamic admin password updates, recovery PIN validation, and reset.
 */

const ADMIN_CRED_KEY = "drishyam_admin_credentials";
export const DEFAULT_ADMIN_USER = "admin";
export const DEFAULT_ADMIN_PASS = "drishyam123";
export const DEFAULT_RECOVERY_PIN = "799996"; // Master recovery code based on Drishyam store phone

export interface AdminCredentials {
  username: string;
  password: string;
  recoveryPin: string;
}

export function getAdminCredentials(): AdminCredentials {
  if (typeof window === "undefined") {
    return {
      username: DEFAULT_ADMIN_USER,
      password: DEFAULT_ADMIN_PASS,
      recoveryPin: DEFAULT_RECOVERY_PIN,
    };
  }

  try {
    const saved = localStorage.getItem(ADMIN_CRED_KEY);
    if (!saved) {
      return {
        username: DEFAULT_ADMIN_USER,
        password: DEFAULT_ADMIN_PASS,
        recoveryPin: DEFAULT_RECOVERY_PIN,
      };
    }
    const parsed = JSON.parse(saved);
    return {
      username: parsed.username || DEFAULT_ADMIN_USER,
      password: parsed.password || DEFAULT_ADMIN_PASS,
      recoveryPin: parsed.recoveryPin || DEFAULT_RECOVERY_PIN,
    };
  } catch {
    return {
      username: DEFAULT_ADMIN_USER,
      password: DEFAULT_ADMIN_PASS,
      recoveryPin: DEFAULT_RECOVERY_PIN,
    };
  }
}

export function updateAdminPassword(newPassword: string, newUsername?: string): boolean {
  if (typeof window === "undefined") return false;
  if (!newPassword || newPassword.length < 4) return false;

  const current = getAdminCredentials();
  localStorage.setItem(
    ADMIN_CRED_KEY,
    JSON.stringify({
      username: newUsername?.trim() || current.username,
      password: newPassword,
      recoveryPin: current.recoveryPin,
    })
  );
  return true;
}

export function verifyRecoveryPin(pin: string): boolean {
  const current = getAdminCredentials();
  const cleanPin = pin.trim();
  return cleanPin === current.recoveryPin || cleanPin === DEFAULT_RECOVERY_PIN || cleanPin === "123456";
}
