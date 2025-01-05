import { useState } from "react";
import { ProjectGrid } from "@/components/ProjectGrid";
import { useToast } from "@/components/ui/use-toast";

// Mock data - will be replaced with Supabase data later
const initialProjects = [
  {
    id: "1",
    title: "Website Redesign",
    description: "Redesign company website with modern UI",
    tags: ["Work", "Design"],
    tasks: [
      { id: "t1", content: "Create wireframes", completed: true },
      { id: "t2", content: "Design homepage", completed: false },
      { id: "t3", content: "Implement responsive layout", completed: false },
    ],
  },
  {
    id: "2",
    title: "Home Renovation",
    description: "Planning and executing home improvements",
    tags: ["Personal"],
    tasks: [
      { id: "t4", content: "Paint living room", completed: false },
      { id: "t5", content: "Replace kitchen faucet", completed: true },
    ],
  },
  {
    id: "3",
    title: "Fitness Goals",
    description: "Track and achieve fitness milestones",
    tags: ["Personal", "Health"],
    tasks: [
      { id: "t6", content: "Run 5k", completed: false },
      { id: "t7", content: "Meal prep for week", completed: true },
      { id: "t8", content: "Gym 3x per week", completed: false },
    ],
  },
];

const Index = () => {
  const [projects, setProjects] = useState(initialProjects);
  const { toast } = useToast();

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(projects);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setProjects(items);
    toast({
      title: "Project reordered",
      description: "The project has been moved to a new position.",
    });
  };

  const handleTaskToggle = (projectId: string, taskId: string) => {
    setProjects(projects.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          tasks: project.tasks.map(task => 
            task.id === taskId ? { ...task, completed: !task.completed } : task
          ),
        };
      }
      return project;
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-foreground">My Projects</h1>
          <p className="text-muted-foreground mt-2">Manage your personal and work projects</p>
        </div>
      </header>
      <main className="container mx-auto">
        <ProjectGrid
          projects={projects}
          onDragEnd={handleDragEnd}
          onTaskToggle={handleTaskToggle}
        />
      </main>
    </div>
  );
};

export default Index;