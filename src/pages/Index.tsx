import { useState } from "react";
import { ProjectGrid } from "@/components/ProjectGrid";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LogOut, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";

const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState("");

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .order('position');

      if (projectsError) throw projectsError;

      const projectsWithDetails = await Promise.all(
        projectsData.map(async (project) => {
          const { data: tasks } = await supabase
            .from('tasks')
            .select('*')
            .eq('project_id', project.id)
            .order('position');

          const { data: projectTags } = await supabase
            .from('project_tags')
            .select('tags(name)')
            .eq('project_id', project.id);

          return {
            id: project.id.toString(),
            title: project.title,
            description: project.description,
            tags: projectTags?.map((pt: any) => pt.tags.name) || [],
            tasks: tasks?.map((task: any) => ({
              id: task.id.toString(),
              content: task.content,
              completed: task.completed,
            })) || [],
          };
        })
      );

      return projectsWithDetails;
    },
  });

  const createProjectMutation = useMutation({
    mutationFn: async (title: string) => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('projects')
        .insert([
          { 
            title,
            user_id: userData.user.id,
            position: projects.length 
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({
        title: "Success",
        description: "Project created successfully",
      });
      setIsAddingProject(false);
      setNewProjectTitle("");
    },
  });

  const updateProjectMutation = useMutation({
    mutationFn: async ({ id, title }: { id: string, title: string }) => {
      const { error } = await supabase
        .from('projects')
        .update({ title })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({
        title: "Success",
        description: "Project updated successfully",
      });
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({
        title: "Success",
        description: "Project deleted successfully",
      });
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

  const createTaskMutation = useMutation({
    mutationFn: async ({ projectId, content }: { projectId: string, content: string }) => {
      const { error } = await supabase
        .from('tasks')
        .insert([
          { 
            project_id: projectId,
            content,
            completed: false,
            position: projects.find(p => p.id === projectId)?.tasks.length || 0
          }
        ]);

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
        .eq('id', taskId);

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
      createProjectMutation.mutate(newProjectTitle);
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
          <div className="flex items-center gap-4">
            {isAddingProject ? (
              <div className="flex gap-2">
                <Input
                  placeholder="Enter project title..."
                  value={newProjectTitle}
                  onChange={(e) => setNewProjectTitle(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleCreateProject()}
                />
                <Button onClick={handleCreateProject}>Add</Button>
              </div>
            ) : (
              <Button onClick={() => setIsAddingProject(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            )}
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>
      <main className="container mx-auto">
        <ProjectGrid
          projects={projects}
          onDragEnd={handleDragEnd}
          onTaskToggle={handleTaskToggle}
          onProjectEdit={(id, title) => updateProjectMutation.mutate({ id, title })}
          onTaskAdd={(projectId, content) => createTaskMutation.mutate({ projectId, content })}
          onTaskEdit={(projectId, taskId, content) => updateTaskContentMutation.mutate({ taskId, content })}
          onProjectDelete={(id) => deleteProjectMutation.mutate(id)}
        />
      </main>
    </div>
  );
};

export default Index;