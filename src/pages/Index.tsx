import { useState } from "react";
import { ProjectGrid } from "@/components/ProjectGrid";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ProjectHeader } from "@/components/ProjectHeader";
import { EmptyProjectsCard } from "@/components/EmptyProjectsCard";
import { useProjects } from "@/hooks/useProjects";
import { useTasks } from "@/hooks/useTasks";
import { useProjectPositions } from "@/hooks/useProjectPositions";
import { DeepWorkModal } from "@/components/DeepWorkModal";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState("");
  const [isDeepWorkModalOpen, setIsDeepWorkModalOpen] = useState(false);
  
  const { projects, isLoading, createProject, updateProject, deleteProject } = useProjects();
  const { updateTask, createTask, updateTaskContent } = useTasks();
  const { updateProjectPositions } = useProjectPositions();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    } else {
      navigate("/auth");
    }
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(projects);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    updateProjectPositions(items);
  };

  const handleCreateProject = () => {
    if (newProjectTitle.trim()) {
      createProject(newProjectTitle);
      setIsAddingProject(false);
      setNewProjectTitle("");
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading projects...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <ProjectHeader onSignOut={handleSignOut} />
      <main className="container mx-auto">
        <div className="fixed bottom-8 right-8 z-20">
          <Button
            size="lg"
            onClick={() => setIsDeepWorkModalOpen(true)}
            className="bg-primary/20 hover:bg-primary/40 text-primary-foreground shadow-lg hover:shadow-xl transition-all group"
          >
            <Play className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
            Start Deep Work
          </Button>
        </div>
        
        {projects.length === 0 ? (
          <div className="p-6">
            <EmptyProjectsCard onAddProject={() => setIsAddingProject(true)} />
          </div>
        ) : (
          <ProjectGrid
            projects={projects}
            onDragEnd={handleDragEnd}
            onTaskToggle={(projectId, taskId) => {
              const project = projects.find(p => p.id === projectId);
              const task = project?.tasks.find(t => t.id === taskId);
              if (task) {
                updateTask({
                  projectId,
                  taskId,
                  completed: !task.completed,
                });
              }
            }}
            onProjectEdit={(id, title) => updateProject({ id, title })}
            onTaskAdd={(projectId, content) => createTask({ projectId, content })}
            onTaskEdit={(projectId, taskId, content) => updateTaskContent({ taskId, content })}
            onProjectDelete={deleteProject}
            isAddingProject={isAddingProject}
            newProjectTitle={newProjectTitle}
            onNewProjectTitleChange={setNewProjectTitle}
            onCreateProject={handleCreateProject}
            onAddProjectClick={() => setIsAddingProject(true)}
          />
        )}

        <DeepWorkModal
          isOpen={isDeepWorkModalOpen}
          onClose={() => setIsDeepWorkModalOpen(false)}
          projects={projects}
        />
      </main>
    </div>
  );
};

export default Index;