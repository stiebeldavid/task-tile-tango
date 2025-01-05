import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface EmptyProjectsCardProps {
  onAddProject: () => void;
}

export const EmptyProjectsCard = ({ onAddProject }: EmptyProjectsCardProps) => {
  return (
    <Card className="h-96 flex items-center justify-center">
      <CardContent className="text-center space-y-4">
        <h3 className="text-2xl font-semibold text-muted-foreground">No projects yet</h3>
        <p className="text-muted-foreground">Create your first project to get started</p>
        <Button onClick={onAddProject} size="lg">
          <Plus className="h-4 w-4 mr-2" />
          Add Your First Project
        </Button>
      </CardContent>
    </Card>
  );
};