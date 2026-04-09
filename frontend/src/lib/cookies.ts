"use server"
import { cookies } from 'next/headers';
export async function saveTokens(access: string, refresh: string)  {
  const cookieStore = await cookies();
  cookieStore.set('access_token', access, { maxAge: 60 * 60 * 24 , httpOnly: true, secure: true});
  cookieStore.set('refresh_token', refresh, { maxAge: 60 * 60 * 24 * 7 , httpOnly: true, secure: true});
};

export async function getAccessToken() {
  const cookieStore = await cookies();
  return cookieStore.get('access_token')?.value;
};

export async function getRefreshToken() {
  const cookieStore = await cookies();
  return cookieStore.get('refresh_token')?.value;
};

export async function clearTokens()  {
  const cookieStore = await cookies();
  cookieStore.delete('access_token');
  cookieStore.delete('refresh_token');
};