import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

export const useProjects = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Listen for auth changes to clear cache
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        queryClient.clear(); // Clear all queries on logout
      }
    });

    return () => subscription.unsubscribe();
  }, [queryClient]);

  // First stage: Fetch basic project info
  const { data: projectsBasic = [], isLoading: isLoadingBasic } = useQuery({
    queryKey: ['projects-basic'],
    queryFn: async () => {
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('id, title, description, position')
        .order('position');

      if (projectsError) throw projectsError;
      return projectsData.map(project => ({
        id: project.id.toString(),
        title: project.title,
        description: project.description,
        tags: [],
        tasks: [],
      }));
    },
  });

  // Second stage: Fetch full project details
  const { data: projects = [], isLoading: isLoadingDetails } = useQuery({
    queryKey: ['projects-full'],
    queryFn: async () => {
      const projectsWithDetails = await Promise.all(
        projectsBasic.map(async (project) => {
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
            ...project,
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
    enabled: projectsBasic.length > 0, // Only run if we have basic project data
  });

  const createProjectMutation = useMutation({
    mutationFn: async (title: string) => {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) throw new Error("Not authenticated");
      
      const { data, error } = await supabase
        .from('projects')
        .insert({
          title,
          User_UID: userData.user.id, // Using User_UID directly with the UUID from auth
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
    isLoading: isLoadingBasic || isLoadingDetails,
    isLoadingDetails,
    projectsBasic,
    createProject: createProjectMutation.mutate,
    updateProject: updateProjectMutation.mutate,
    deleteProject: deleteProjectMutation.mutate,
  };
};
