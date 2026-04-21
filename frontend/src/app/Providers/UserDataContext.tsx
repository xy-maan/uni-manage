'use client';
import React, { createContext, useState, ReactNode, Dispatch, SetStateAction, useEffect } from "react"
type User = {
  role: string;
  is_complete: boolean;
} | null;
type UserDataContextType = {
  user: User
  setUser: Dispatch<SetStateAction<User>>
  loading: Boolean
  setLoading: Dispatch<SetStateAction<boolean>>
}
export const UserContext = createContext<UserDataContextType | null>(null)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
const [loading, setLoading] = useState(false);

  return (
    <UserContext.Provider value={{ user, setUser, loading, setLoading }}>
      {children}
    </UserContext.Provider>
  );
}

