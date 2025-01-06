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
    <header className="border-b border-border/50 bg-background/95 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Daily Deep Work
          </h1>
          <p className="text-muted-foreground mt-2">Get Stuff Done</p>
        </div>
        <div className="flex items-center gap-4">
          {isAddingProject ? (
            <div className="flex gap-2">
              <Input
                placeholder="Enter project title..."
                value={newProjectTitle}
                onChange={(e) => onNewProjectTitleChange(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && onCreateProject()}
                className="bg-background/50"
              />
              <Button 
                onClick={onCreateProject}
                className="bg-primary/20 hover:bg-primary/40 text-primary-foreground"
              >
                Add
              </Button>
            </div>
          ) : (
            <Button 
              onClick={onAddProjectClick}
              className="bg-primary/20 hover:bg-primary/40 text-primary-foreground group"
            >
              <Plus className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
              New Project
            </Button>
          )}
          <Button 
            variant="outline" 
            onClick={onSignOut}
            className="border-border/50 hover:bg-destructive/20 hover:text-destructive-foreground transition-colors"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  );
};