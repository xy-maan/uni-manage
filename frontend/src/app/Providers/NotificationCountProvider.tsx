// Context/NotificationCount.tsx
"use client";
import React, { createContext, useState, ReactNode, Dispatch, SetStateAction, useEffect } from "react";
import { GetInvitationsAction } from "@/Actions/invitations/getInvitations.action";
import getAuthData from "@/utilities/getAuthData";

type NotificationCountContextType = {
//   notificationCount: number;
//   setNotificationCount: Dispatch<SetStateAction<number>>;
  invitationCount: number;
  setInvitationCount: Dispatch<SetStateAction<number>>;
};

export const NotificationCountContext = createContext<NotificationCountContextType | null>(null);

export default function NotificationCountProvider({ children }: { children: ReactNode }) {
//   const [notificationCount, setNotificationCount] = useState(0);
  const [invitationCount, setInvitationCount] = useState(0);

  async function getCounts() {
    const session = await getAuthData();
    if (!session?.django.access) return;

    // const { ok: notifOk, payload: notifPayload } = await GetUnreadCountAction();
    // if (notifOk) {
    //   setNotificationCount(notifPayload.count);
    // }

    const { ok: invOk, payload: invPayload } = await GetInvitationsAction();
    if (invOk) {
      const pending = invPayload.filter((inv: any) => inv.status === "pending");
      setInvitationCount(pending.length);
    }
  }

  useEffect(() => {
    getCounts();
  }, []);

  return (
    <NotificationCountContext.Provider
      value={{ invitationCount, setInvitationCount }}
    >
      {children}
    </NotificationCountContext.Provider>
  );
}