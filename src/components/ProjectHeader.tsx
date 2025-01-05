import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogOut, Plus } from "lucide-react";

interface ProjectHeaderProps {
  isAddingProject: boolean;
  newProjectTitle: string;
  onNewProjectTitleChange: (value: string) => void;
  onCreateProject: () => void;
  onAddProjectClick: () => void;
  onSignOut: () => void;
}

export const ProjectHeader = ({
  isAddingProject,
  newProjectTitle,
  onNewProjectTitleChange,
  onCreateProject,
  onAddProjectClick,
  onSignOut,
}: ProjectHeaderProps) => {
  return (
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
                onChange={(e) => onNewProjectTitleChange(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && onCreateProject()}
              />
              <Button onClick={onCreateProject}>Add</Button>
            </div>
          ) : (
            <Button onClick={onAddProjectClick}>
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          )}
          <Button variant="outline" onClick={onSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  );
};