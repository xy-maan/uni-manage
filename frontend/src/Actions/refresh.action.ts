// "use server";
// export async function refreshTokenAction(refreshToken: string) {
//   const res = await fetch(
//     `${process.env.NEXT_PUBLIC_BASE_URL}/users/token/refresh/`,
//     {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ refresh: refreshToken }),
//     }
//   );

//   const data = await res.json();
// console.log("Refresh response:", data);
//   return {
//     ok: res.ok,
//     access: res.ok ? data.access : null,
//   };
// }
"use server";

export async function refreshTokenAction(refreshToken: string) {
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
    };
  } catch {
    return { ok: false, access: null };
  }
}