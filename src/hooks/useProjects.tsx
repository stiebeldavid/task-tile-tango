import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useProjects = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) throw new Error("Not authenticated");

      // Get the numeric user ID from the auth ID
      const userId = BigInt(userData.user.id);
      
      const { data, error } = await supabase
        .from('projects')
        .insert({
          title,
          user_id: userId,
          position: projects.length
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating project:", error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({
        title: "Success",
        description: "Project created successfully",
      });
    },
    onError: (error) => {
      console.error("Project creation error:", error);
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateProjectMutation = useMutation({
    mutationFn: async ({ id, title }: { id: string, title: string }) => {
      const { error } = await supabase
        .from('projects')
        .update({ title })
        .eq('id', parseInt(id));

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
        .eq('id', parseInt(id));

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

  return {
    projects,
    isLoading,
    createProject: createProjectMutation.mutate,
    updateProject: updateProjectMutation.mutate,
    deleteProject: deleteProjectMutation.mutate,
  };
};