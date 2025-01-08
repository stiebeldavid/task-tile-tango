import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

interface EmptyProjectsCardProps {
  onAddProject: (title: string) => void;
}

export const EmptyProjectsCard = ({ onAddProject }: EmptyProjectsCardProps) => {
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState("");

  const handleCreateProject = () => {
    if (newProjectTitle.trim()) {
      onAddProject(newProjectTitle.trim());
      setNewProjectTitle("");
      setIsAddingProject(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCreateProject();
    }
  };

  return (
    <Card className="p-8 text-center bg-background/50 border-dashed">
      <div className="max-w-md mx-auto space-y-6">
        <h3 className="text-2xl font-semibold">No Projects Yet</h3>
        <p className="text-muted-foreground">
          Create your first project to start organizing your tasks and tracking your deep work sessions.
        </p>
        
        {isAddingProject ? (
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center max-w-md mx-auto">
            <Input
              placeholder="Enter project title..."
              value={newProjectTitle}
              onChange={(e) => setNewProjectTitle(e.target.value)}
              onKeyPress={handleKeyPress}
              className="bg-background/50"
              autoFocus
            />
            <Button 
              onClick={handleCreateProject}
              className="bg-primary/20 hover:bg-primary/40 text-primary-foreground"
            >
              Add
            </Button>
          </div>
        ) : (
          <Button 
            onClick={() => setIsAddingProject(true)}
            className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white shadow-lg hover:shadow-xl transition-all group"
          >
            <Plus className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
            New Project
          </Button>
        )}
      </div>
    </Card>
  );
};