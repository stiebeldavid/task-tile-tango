import { useState } from "react";
import { ProjectGrid } from "@/components/ProjectGrid";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          tasks (*),
          project_tags (
            tag_id,
            tags (name)
          )
        `)
        .order('position');

      if (error) throw error;

      return data.map(project => ({
        id: project.id.toString(),
        title: project.title,
        description: project.description,
        tags: project.project_tags.map((pt: any) => pt.tags.name),
        tasks: project.tasks.map((task: any) => ({
          id: task.id.toString(),
          content: task.content,
          completed: task.completed,
        })),
      }));
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ projectId, taskId, completed }: { projectId: string; taskId: string; completed: boolean }) => {
      const { error } = await supabase
        .from('tasks')
        .update({ completed })
        .eq('id', taskId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  const updateProjectPositionMutation = useMutation({
    mutationFn: async (updatedProjects: any[]) => {
      const updates = updatedProjects.map((project, index) => ({
        id: parseInt(project.id),
        position: index,
      }));

      const { error } = await supabase
        .from('projects')
        .upsert(updates, { onConflict: 'id' });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(projects);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    updateProjectPositionMutation.mutate(items);
    toast({
      title: "Project reordered",
      description: "The project has been moved to a new position.",
    });
  };

  const handleTaskToggle = (projectId: string, taskId: string) => {
    const project = projects.find(p => p.id === projectId);
    const task = project?.tasks.find(t => t.id === taskId);
    if (task) {
      updateTaskMutation.mutate({
        projectId,
        taskId,
        completed: !task.completed,
      });
    }
  };

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

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading projects...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Projects</h1>
            <p className="text-muted-foreground mt-2">Manage your personal and work projects</p>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
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