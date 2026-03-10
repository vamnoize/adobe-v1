import { getTasks } from "./actions/tasks";
import { TaskLauncher } from "@/components/dashboard/TaskLauncher";
import { ActiveWorkflows } from "@/components/dashboard/ActiveWorkflows";
import { Database } from "@/types/database";

export default 
async function Dashboard() {
  const tasks = await getTasks();

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      <div>
        <h1 className="text-3xl font-light tracking-tight mb-2 text-[var(--foreground)]">Task Launcher</h1>
        <p className="text-[var(--muted-foreground)]">Enter a keyword to initiate the automated stock photo pipeline.</p>
      </div>

      <TaskLauncher />

      <div className="pt-8">
        <h2 className="text-xl font-medium tracking-tight mb-8 text-[var(--foreground)]">Active Workflows</h2>
        
        <ActiveWorkflows tasks={tasks as unknown as Database["public"]["Tables"]["tasks"]["Row"][]} />
      </div>
    </div>
  );
}

