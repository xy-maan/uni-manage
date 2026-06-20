"use server"
export async function SearchTechnologyAction(query: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/projects/technologies/search/?q=${query}`
  );
  const payload = await res.json();
  return { payload, ok: res.ok };
}