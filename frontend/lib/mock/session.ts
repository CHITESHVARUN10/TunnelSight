"use client";
// Mock session: localStorage-backed demo auth. Mirrors backend session semantics:
// login sets a session, me() reads it, logout clears it.

import { DEMO_EMAIL, DEMO_PASSWORD } from "./flag";

export type MockUser = { id: string; email: string; displayName: string };

const KEY = "ts_mock_session";
const USERS_KEY = "ts_mock_users";

const DEMO_USER: MockUser = {
  id: "00000000-0000-4000-8000-000000000001",
  email: DEMO_EMAIL,
  displayName: "Analyst",
};

function readUsers(): Record<string, { password: string; displayName: string }> {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) ?? "{}");
  } catch {
    return {};
  }
}

export function mockLogin(email: string, password: string): MockUser {
  const e = email.trim().toLowerCase();
  if (e === DEMO_EMAIL && password === DEMO_PASSWORD) {
    localStorage.setItem(KEY, JSON.stringify(DEMO_USER));
    return DEMO_USER;
  }
  const users = readUsers();
  const u = users[e];
  if (!u || u.password !== password) throw new Error("Invalid credentials. Use the demo account shown on the card.");
  const user = { id: `local-${e}`, email: e, displayName: u.displayName };
  localStorage.setItem(KEY, JSON.stringify(user));
  return user;
}

export function mockRegister(email: string, password: string, displayName: string): MockUser {
  const e = email.trim().toLowerCase();
  if (e === DEMO_EMAIL) throw new Error("Email already registered. Sign in instead.");
  const users = readUsers();
  if (users[e]) throw new Error("Email already registered. Sign in instead.");
  if (password.length < 8) throw new Error("Password must be at least 8 characters.");
  users[e] = { password, displayName: displayName || e.split("@")[0] };
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  const user = { id: `local-${e}`, email: e, displayName: users[e].displayName };
  localStorage.setItem(KEY, JSON.stringify(user));
  return user;
}

export function mockMe(): MockUser | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as MockUser) : null;
  } catch {
    return null;
  }
}

export function mockLogout(): void {
  localStorage.removeItem(KEY);
}
