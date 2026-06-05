import { Award, GraduationCap } from "lucide-react";
import React from "react";

export default function HeaderForm({
  variant,
  step,
}: {
  variant: string | null;
  step: number;
}) {
  const student = {
    h3: "Complete Your Profile",
    p: "Tell us about your academic background and interests",
  };

  const supervisor = {
    h3: "Complete Your Profile",
    p: "Provide your academic credentials and verification",
  };
  return (
    <div className="flex items-center gap-3">
      {step > 1 ? (
        <div
          className={`size-10 rounded-xl ${variant == "supervisor" ? "bg-secondary/10" : "bg-primary/10"} flex items-center justify-center`}
        >
          {variant == "student" && (
            <GraduationCap className="text-primary size-5" />
          )}
          {variant == "supervisor" && (
            <Award className="text-secondary size-5" />
          )}
        </div>
      ) : (
        <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <GraduationCap className="text-primary size-5" />
        </div>
      )}

      {step > 1 ? (
        <div className="">
          {" "}
          <h3 className="leading-none">
            {variant == "student" && student.h3}
            {variant == "supervisor" && supervisor.h3}
            {step == 1 && "Choose Your Role"}
          </h3>
          <p className="text-muted-foreground text-sm mt-1">
            {variant == "student" && student.p}
            {variant == "supervisor" && supervisor.p}
            {step == 1 && "Select how you'll be using UniManage"}
          </p>
        </div>
      ) : (
        <div>
          <h3 className="leading-none">Choose Your Role</h3>
          <p className="text-muted-foreground text-sm mt-1">
            Select how you'll be using UniManage
          </p>
        </div>
      )}
    </div>
  );
}
