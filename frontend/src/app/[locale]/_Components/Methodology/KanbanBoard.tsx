// KanbanBoard.tsx (Dashboard + drag&drop move)
"use client";
import { GetKanbanDashboardAction } from "@/Actions/methodology/BoardColumns/GetKanbanDashboard.action";
import { UpdateTaskAction } from "@/Actions/Tasks/tasks/replaceTask.action";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import CreateColumnBtn from "./Btns/Kanban/CreateColumnBtn";
import EditColumnBtn from "./Btns/Kanban/EditColumnBtn";
import DeleteColumnBtn from "./Btns/Kanban/DeleteColumnBtn";
import DeleteTaskBtn from "../Btns/DeleteTaskBtn/DeleteTaskBtn";
import CreateTaskBtn from "../Btns/CreateTaskBtn/CreateTaskBtn";
import TaskDetailDialog from "../Tasks/TaskDetailDialog";
import { Kanban, KanbanColumnWithTasks } from "@/types/methodology";
import { Task } from "@/types/task";
import Loading from "../CommunityComponent/Loading";

function mapColumnToStatus(columnName: string): string {
  const map: Record<string, string> = {
    "To Do": "todo",
    "In Progress": "in_progress",
    "In Review": "review",
    "Done": "done",
  };
  return map[columnName] ?? "todo";
}

export default function KanbanBoard({
  projectId,
  members,
  isParticipant,
  currentUserEmail,
}: {
  projectId: number;
  members: any[];
  isParticipant: boolean;
  currentUserEmail: string;
}) {
  const [columns, setColumns] = useState<KanbanColumnWithTasks[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggedTaskId, setDraggedTaskId] = useState<number | null>(null);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);            
  async function loadBoard() {
    setLoading(true);
    const { ok, payload } = await GetKanbanDashboardAction(projectId);
    if (ok) {
      setColumns(payload.columns);
      setTasks(payload.columns.flatMap((c: KanbanColumnWithTasks) => c.tasks));
    } else {
      toast.error("Failed to load board", { position: "top-center", duration: 2000 });
    }
    setLoading(false);
  }

  useEffect(() => {
    loadBoard();
  }, [projectId]);

  async function handleMoveTask(taskId: number, toColumnId: number, toStatus: string) {
    const prevTasks = tasks;
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, board_column: toColumnId, status: toStatus } : t)));

    const { payload, ok } = await UpdateTaskAction(taskId, {
      board_column: toColumnId,
      status: toStatus,
      position: 0,
    });

    if (ok) {
      setTasks((prev) => prev.map((t) => (t.id === taskId ? payload : t)));
    } else {
      setTasks(prevTasks);
      toast.error("faild move task", { position: "top-center", duration: 2000 });
    }
  }

  if (loading) return<Loading/>;

  return (
    <div className="space-y-3">
      {isParticipant && (
        <CreateColumnBtn
          projectId={projectId}
          position={columns.length + 1}
          onCreated={(newCol) => setColumns((prev) => [...prev, { ...newCol, tasks: [] }])}
        />
      )}

      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((col) => {
          const columnTasks = tasks.filter((t) => t.board_column === col.id);
          return (
            <div
              key={col.id}
              className="min-w-[260px] rounded-xl border border-border bg-card p-4 space-y-3"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (draggedTaskId) {
                  handleMoveTask(draggedTaskId, col.id, mapColumnToStatus(col.name));
                  setDraggedTaskId(null);
                }
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">{col.name}</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                    {columnTasks.length}{col.wip_limit ? `/${col.wip_limit}` : ""}
                  </span>
                  {isParticipant && (
                    <>
                      <EditColumnBtn column={col} setColumns={setColumns} />
                      <DeleteColumnBtn column_id={col.id} name={col.name} setColumns={setColumns} />
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                {columnTasks.map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={() => setDraggedTaskId(task.id)}
                    onClick={() => setSelectedTask(task)}
                    className="rounded-lg border border-border bg-background p-3 space-y-1.5 cursor-pointer hover:border-primary/40 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-foreground">{task.title}</p>
                      {isParticipant && (
                        <span onClick={(e) => e.stopPropagation()}>
                          <DeleteTaskBtn task_id={task.id} title={task.title} setTasks={setTasks} />
                        </span>
                      )}
                    </div>
                    {task.assignee_detail && (
                      <p className="text-xs text-muted-foreground">{task.assignee_detail.full_name}</p>
                    )}
                  </div>
                ))}
              </div>

              {isParticipant && (
                <CreateTaskBtn
                  projectId={projectId}
                  boardColumnId={col.id}
                  members={members}
                  onCreated={(newTask) => setTasks((prev) => [...prev, newTask])}
                />
              )}
            </div>
          );
        })}
      </div>

      {selectedTask && (
   <TaskDetailDialog
    open={!!selectedTask}
    onClose={() => setSelectedTask(null)}
    task={selectedTask}
    members={members}
    projectId={projectId} 
    isParticipant={isParticipant}
    currentUserEmail={currentUserEmail}
    setTasks={setTasks}
  />
      )}
    </div>
  );
}