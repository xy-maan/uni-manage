import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { GetUserStatus } from "@/Actions/status.action";
import { redirect } from "next/navigation";
import HomeUi from "./(main)/Home/page";
import getAuthData from "@/utilities/getAuthData";
import { refreshTokenAction } from "@/Actions/refresh.action";

export default async function BasicPage() {
   const auth = await getAuthData();
//not login
 if (!auth?.django?.access) {
    return <HomeUi />;
  }
  if (auth.nextAuth?.error === "RefreshAccessTokenError") {
    redirect("/login?error=session_expired");
  }

   const accessToken = auth.django.access;

  const { payload, ok } = await GetUserStatus(accessToken);
  
  if (!ok) {
    redirect("/login?error=session_expired");
  }

  if (payload.is_complete) {
    redirect(`/${payload.role.toLowerCase()}/dashboard`);
  } else {
    redirect("/complete-profile");
  }
}
//   if (!session?.djangoAccess) {
//     return <HomeUi />;
//   }

//   const { payload, ok } = await GetUserStatus(session.djangoAccess);

//   if (!ok) {
//     redirect("/login?error=session_expired");
//   }

//   if (payload.is_complete) {
//     redirect(`/${payload.role.toLowerCase()}/dashboard`);
//   } else {
//     redirect("/complete-profile");
//   }
// }