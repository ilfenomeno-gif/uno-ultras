export async function login(username: string, pin: string): Promise<{ ok: boolean }> {
  const ok = username.length > 0 && /^\d{4,6}$/.test(pin);
  return { ok };
}
