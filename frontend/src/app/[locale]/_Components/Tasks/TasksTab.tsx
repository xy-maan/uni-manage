"use client";
import KanbanBoard from "../Methodology/KanbanBoard";
import MilestonesSection from "../Methodology/MilestonesSection";
import SprintsSection from "../Methodology/SprintSection";
import LabelsSection from "./LabelsSection";
import { Membership, Project } from "@/types/team";

export default function TasksTab({
  project,
  members,
  isParticipant,
  currentUserEmail,
}: {
  project: Project;
  members: Membership[];
  isParticipant: boolean;
  currentUserEmail: string;
}) {
  console.log(project.methodology)
  return (
    <div className="space-y-4">
      {/* <LabelsSection projectId={project.id} isParticipant={isParticipant} /> */}

      {project.methodology === "kanban" && (
        <KanbanBoard
          projectId={project.id}
          members={members}
          isParticipant={isParticipant}
          currentUserEmail={currentUserEmail}
        />
      )}

      {project.methodology === "sprint" && (
        <SprintsSection projectId={project.id} isParticipant={isParticipant} />
      )}

      {project.methodology === "milestone" && (
        <MilestonesSection projectId={project.id} isParticipant={isParticipant} />
      )}
    </div>
  );
}