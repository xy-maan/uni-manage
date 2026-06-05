"use server"
export async function SearchTagsAction(query: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/users/skills/search/?q=${query}`
  );
  const payload = await res.json();
  return { payload, ok: res.ok };
}