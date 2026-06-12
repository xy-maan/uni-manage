import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import getAuthData from "@/utilities/getAuthData";
import { Metadata } from "next";
import HomeUi from "./_Components/HomeComponents/page";
import { redirect } from "@/i18n/navigation";
 export const metadata: Metadata = {
   title: "Home",
 };
export default async function BasicPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
   const auth = await getAuthData();
     const { locale } = await params;
  const session = await getServerSession(authOptions);

  if (session?.error||!session?.djangoAccess) {
    //  redirect({ href: "/login?error=session_expired", locale });
     return <HomeUi />;
  }

  if (session?.isComplete) {
        redirect({ href: `/${session.role?.toLowerCase()}/dashboard`, locale });
  } else {
    redirect({ href: "/complete-profile", locale });
  }
}