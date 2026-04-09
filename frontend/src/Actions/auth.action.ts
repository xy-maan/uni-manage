"use server";
export async function GetUserStatus(token: string) {
      const res = await fetch('http://localhost:8000/api/users/status/', {
         method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });

      const payload = await res.json();
  return{
    payload,
    ok: res.ok,
  }
}
