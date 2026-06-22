"use server";
export async function refreshTokenAction(refreshToken: string) {
   ("🔄 Calling refresh endpoint...");
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/users/token/refresh/`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: refreshToken }),
      }
    );

    if (!res.ok) {
      return { ok: false, access: null };
    }

    const data = await res.json();
    return {
      ok: true,
      access: data.access,
      refresh: res.ok ? data.refresh : null,
    };
  } catch {
    return { ok: false, access: null };
  }
}