"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import React from "react";
export default function Navbar() {
  const { theme, setTheme } = useTheme();
  return (
    <header className="dark:bg-[#0f172a] bg-white p-4 text-white flex items-center justify-between border-b dark:border-gray-700 border-gray-300">
      <div className="container mx-auto flex justify-between items-center ">
        <span className="text-[15px] text-foreground">Back to Home</span>
        <div className="">
          <h1 className="bg-linear-to-r text-2xl from-(--primary) to-(--secondary) bg-clip-text text-transparent font-bold">
            UniManage
          </h1>
        </div>
        <ul>
          <li>
            {theme === "light" ? (
          <Moon
            onClick={() => setTheme("dark")}
            className="cursor-pointer size-5 text-black"
          />
        ) : (
          <Sun
            onClick={() => setTheme("light")}
            className="cursor-pointer size-5 "
          />
        )}
          </li>
        </ul>
      </div>
    </header>
  );
}
