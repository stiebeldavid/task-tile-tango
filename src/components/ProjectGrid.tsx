import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { ProjectCard } from "./ProjectCard";

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
}

export const ProjectGrid = ({ projects, onDragEnd, onTaskToggle }: ProjectGridProps) => {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="projects" direction="horizontal">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6"
          >
            {projects.map((project, index) => (
              <ProjectCard
                key={project.id}
                id={project.id}
                index={index}
                title={project.title}
                description={project.description}
                tags={project.tags}
                tasks={project.tasks}
                onTaskToggle={(taskId) => onTaskToggle(project.id, taskId)}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};