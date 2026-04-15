// "use client";
// import { getAccessToken } from "@/lib/cookies";
// import { UserData } from "@/types/userStatus";
// import React, {
//   Children,
//   createContext,
//   Dispatch,
//   SetStateAction,
//   useEffect,
//   useState,
// } from "react";
// type UserContextType = {
//   token: string | null;
//   setToken: Dispatch<SetStateAction<string | null>>;
//   AuthLoading: boolean;
//   setAuthLoading: Dispatch<SetStateAction<boolean>>;
//   userData: UserData | null;
//   setUserData: Dispatch<SetStateAction<UserData | null>>;
//   fetchUser: () => Promise<void>;
// };
// export const AuthContext = createContext<UserContextType | null>(null);
// export default function UserContextProvider({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const [userData, setUserData] = useState<UserData | null>(null);
//   const [AuthLoading, setAuthLoading] = useState(true);
//   async function fetchUser() {
//     const token = await getAccessToken();
//     if (!token) return;
//     const { payload, ok } = await GetUserStatus(token);
//     if (ok) {
//       setUserData(payload);
//     }
//   }
//   async function checkAuth() {
//     const myToken = await getAccessToken();
//     setToken(myToken ? myToken : null);
//     setAuthLoading(false);
//   }
//   useEffect(() => {
//     checkAuth();
//   }, []);
//   useEffect(() => {
//     if (token && !userData) {
//       fetchUser();
//     }
//   }, [token]);
//   return (
//     <AuthContext.Provider
//       value={{
//         token,
//         setToken,
//         AuthLoading,
//         setAuthLoading,
//         userData,
//         setUserData,
//         fetchUser,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// }
