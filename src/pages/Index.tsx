import { useState } from "react";
import { ProjectGrid } from "@/components/ProjectGrid";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProjectHeader } from "@/components/ProjectHeader";
import { EmptyProjectsCard } from "@/components/EmptyProjectsCard";
import { useProjects } from "@/hooks/useProjects";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState("");
  
  const { projects, isLoading, createProject, updateProject, deleteProject } = useProjects();

  const updateTaskMutation = useMutation({
    mutationFn: async ({ projectId, taskId, completed }: { projectId: string; taskId: string; completed: boolean }) => {
      const { error } = await supabase
        .from('tasks')
        .update({ completed })
        .eq('id', parseInt(taskId));

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  const createTaskMutation = useMutation({
    mutationFn: async ({ projectId, content }: { projectId: string, content: string }) => {
      const { error } = await supabase
        .from('tasks')
        .insert({
          project_id: parseInt(projectId),
          content,
          completed: false,
          position: projects.find(p => p.id === projectId)?.tasks.length || 0
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({
        title: "Success",
        description: "Task added successfully",
      });
    },
  });

  const updateTaskContentMutation = useMutation({
    mutationFn: async ({ taskId, content }: { taskId: string, content: string }) => {
      const { error } = await supabase
        .from('tasks')
        .update({ content })
        .eq('id', parseInt(taskId));

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({
        title: "Success",
        description: "Task updated successfully",
      });
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
      <ProjectHeader
        isAddingProject={isAddingProject}
        newProjectTitle={newProjectTitle}
        onNewProjectTitleChange={setNewProjectTitle}
        onCreateProject={handleCreateProject}
        onAddProjectClick={() => setIsAddingProject(true)}
        onSignOut={handleSignOut}
      />
      <main className="container mx-auto">
        {projects.length === 0 ? (
          <div className="p-6">
            <EmptyProjectsCard onAddProject={() => setIsAddingProject(true)} />
          </div>
        ) : (
          <ProjectGrid
            projects={projects}
            onDragEnd={handleDragEnd}
            onTaskToggle={handleTaskToggle}
            onProjectEdit={(id, title) => updateProject({ id, title })}
            onTaskAdd={(projectId, content) => createTaskMutation.mutate({ projectId, content })}
            onTaskEdit={(projectId, taskId, content) => updateTaskContentMutation.mutate({ taskId, content })}
            onProjectDelete={deleteProject}
          />
        )}
      </main>
    </div>
  );
};

export default Index;