"use client"
import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react";

type CommunityContextType = {
  selectedCategory: number | null;
  setSelectedCategory: Dispatch<SetStateAction<number|null>>
  search: string;

  setSearch: Dispatch<SetStateAction<string>>
  
}
export const CommunityContext = createContext<CommunityContextType | null>(null)
export default function CommunityProvider({ children }: { children: ReactNode }) {
     const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [search, setSearch] = useState<string >("");

 return (
    <CommunityContext.Provider value={{ selectedCategory, setSelectedCategory,search,setSearch }}>
      {children}
    </CommunityContext.Provider>
  )
}
