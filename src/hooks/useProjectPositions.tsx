import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useProjectPositions = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateProjectPositionMutation = useMutation({
    mutationFn: async (updatedProjects: any[]) => {
      const updatePromises = updatedProjects.map((project, index) => 
        supabase
          .from('projects')
          .update({ position: index })
          .eq('id', parseInt(project.id))
      );

      await Promise.all(updatePromises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({
        title: "Project reordered",
        description: "The project has been moved to a new position.",
      });
    },
  });

  return {
    updateProjectPositions: updateProjectPositionMutation.mutate,
  };
};