"use server";
import { StudentData } from "@/types/student";
import getAuthData from "@/utilities/getAuthData";
export async function GetStudentDataAction() {
  const session = await getAuthData();

  if (!session?.django.access) {
    throw new Error("No access token");
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/profile/student/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.django.access}`,
    },
  });
if (!res.ok) {
  throw new Error("Failed to fetch")
}
  const payload:StudentData = await res.json();
  return {
    payload,
  };
}
