import React from "react";

export default function Register() {
  return (
    <div className=" min-h-screen flex flex-col ">
      <div className="w-1/2 mx-auto bg-(--card) flex flex-col items-start justify-start p-4 rounded-xl border border-(--border) ">
        <div className="">
          <div className="">
            <h3 className="text-foreground ">sign in</h3>
            <p className="text-muted-foreground">
              Choose your account type to continue
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
