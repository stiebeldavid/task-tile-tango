import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface ProjectHeaderProps {
  onSignOut: () => void;
}

export const ProjectHeader = ({
  onSignOut,
}: ProjectHeaderProps) => {
  const isMobile = useIsMobile();

  return (
    <header className="border-b border-border/50 bg-background/95 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col gap-6 md:flex-row md:justify-between md:items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Daily Deep Work
            </h1>
            <p className="text-muted-foreground mt-2">Get Stuff Done</p>
          </div>
          <div>
            <Button 
              variant="outline" 
              onClick={onSignOut}
              className="border-border/50 hover:bg-destructive/20 hover:text-destructive-foreground transition-colors"
            >
              <LogOut className="h-4 w-4 mr-2" />
              {isMobile ? "Exit" : "Sign Out"}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};