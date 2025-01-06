import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useTasks = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
          position: 0 // This will be updated by the backend
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

  return {
    updateTask: updateTaskMutation.mutate,
    createTask: createTaskMutation.mutate,
    updateTaskContent: updateTaskContentMutation.mutate,
  };
};