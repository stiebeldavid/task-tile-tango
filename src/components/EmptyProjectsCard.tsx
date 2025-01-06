import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface EmptyProjectsCardProps {
  onAddProject: () => void;
}

export const EmptyProjectsCard = ({ onAddProject }: EmptyProjectsCardProps) => {
  return (
    <Card className="h-96 flex items-center justify-center glass-card border-border/50">
      <CardContent className="text-center space-y-4">
        <h3 className="text-2xl font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          No projects yet
        </h3>
        <p className="text-muted-foreground">Create your first project to get started</p>
        <Button 
          onClick={onAddProject} 
          size="lg"
          className="bg-primary/20 hover:bg-primary/40 text-primary-foreground group"
        >
          <Plus className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
          Add Your First Project
        </Button>
      </CardContent>
    </Card>
  );
};