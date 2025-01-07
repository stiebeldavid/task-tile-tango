import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { ProjectCard } from "./ProjectCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { ProjectLoadingSkeleton } from "./ProjectLoadingSkeleton";

interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  tasks: {
    id: string;
    content: string;
    completed: boolean;
  }[];
}

interface ProjectGridProps {
  projects: Project[];
  onDragEnd: (result: any) => void;
  onTaskToggle: (projectId: string, taskId: string) => void;
  onProjectEdit?: (id: string, title: string) => void;
  onTaskAdd?: (projectId: string, content: string) => void;
  onTaskEdit?: (projectId: string, taskId: string, content: string) => void;
  onProjectDelete?: (id: string) => void;
  isAddingProject: boolean;
  newProjectTitle: string;
  onNewProjectTitleChange: (value: string) => void;
  onCreateProject: () => void;
  onAddProjectClick: () => void;
  isLoading?: boolean;
  isLoadingDetails?: boolean;
  projectsBasic?: Project[];
}

export const ProjectGrid = ({ 
  projects, 
  onDragEnd, 
  onTaskToggle,
  onProjectEdit,
  onTaskAdd,
  onTaskEdit,
  onProjectDelete,
  isAddingProject,
  newProjectTitle,
  onNewProjectTitleChange,
  onCreateProject,
  onAddProjectClick,
  isLoading,
  isLoadingDetails,
  projectsBasic = [],
}: ProjectGridProps) => {
  const isMobile = useIsMobile();

  if (isLoading) {
    return <ProjectLoadingSkeleton />;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="p-6">
        <div className="mb-6">
          {isAddingProject ? (
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center max-w-md">
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
              className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <Plus className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
              New Project
            </Button>
          )}
        </div>
        <Droppable droppableId="projects" direction="horizontal">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {(isLoadingDetails ? projectsBasic : projects).map((project, index) => (
                <ProjectCard
                  key={project.id}
                  id={project.id}
                  index={index}
                  title={project.title}
                  description={project.description}
                  tags={project.tags}
                  tasks={project.tasks}
                  onTaskToggle={(taskId) => onTaskToggle(project.id, taskId)}
                  onProjectEdit={onProjectEdit}
                  onTaskAdd={onTaskAdd}
                  onTaskEdit={onTaskEdit}
                  onProjectDelete={onProjectDelete}
                  isLoadingDetails={isLoadingDetails}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </DragDropContext>
  );
};