import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { GripVertical, Tag, PenLine, Plus, Trash2 } from "lucide-react";
import { Draggable } from "@hello-pangea/dnd";
import { useState } from "react";
import { Input } from "@/components/ui/input";

interface Task {
  id: string;
  content: string;
  completed: boolean;
}

interface ProjectCardProps {
  id: string;
  index: number;
  title: string;
  description: string;
  tags: string[];
  tasks: Task[];
  onTaskToggle: (taskId: string) => void;
  onProjectEdit?: (id: string, newTitle: string) => void;
  onTaskAdd?: (projectId: string, taskContent: string) => void;
  onTaskEdit?: (projectId: string, taskId: string, newContent: string) => void;
  onProjectDelete?: (id: string) => void;
}

export const ProjectCard = ({ 
  id, 
  index, 
  title, 
  description, 
  tags, 
  tasks, 
  onTaskToggle,
  onProjectEdit,
  onTaskAdd,
  onTaskEdit,
  onProjectDelete
}: ProjectCardProps) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskContent, setNewTaskContent] = useState("");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editedTaskContent, setEditedTaskContent] = useState("");

  const handleTitleSave = () => {
    if (onProjectEdit && editedTitle.trim() !== "") {
      onProjectEdit(id, editedTitle);
      setIsEditingTitle(false);
    }
  };

  const handleTaskAdd = () => {
    if (onTaskAdd && newTaskContent.trim() !== "") {
      onTaskAdd(id, newTaskContent);
      setNewTaskContent("");
      setIsAddingTask(false);
    }
  };

  const handleTaskEdit = (taskId: string) => {
    if (onTaskEdit && editedTaskContent.trim() !== "") {
      onTaskEdit(id, taskId, editedTaskContent);
      setEditingTaskId(null);
    }
  };

  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="mb-6"
        >
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center space-x-4">
              <div {...provided.dragHandleProps} className="cursor-grab">
                <GripVertical className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                {isEditingTitle ? (
                  <div className="flex gap-2">
                    <Input
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleTitleSave()}
                      className="text-lg font-semibold"
                    />
                    <Button size="sm" onClick={handleTitleSave}>Save</Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsEditingTitle(true)}
                      >
                        <PenLine className="h-4 w-4" />
                      </Button>
                      {onProjectDelete && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onProjectDelete(id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  </div>
                )}
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="space-y-2">
                {tasks.map((task) => (
                  <div key={task.id} className="flex items-center space-x-2">
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => onTaskToggle(task.id)}
                    />
                    {editingTaskId === task.id ? (
                      <div className="flex gap-2 flex-1">
                        <Input
                          value={editedTaskContent}
                          onChange={(e) => setEditedTaskContent(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleTaskEdit(task.id)}
                        />
                        <Button size="sm" onClick={() => handleTaskEdit(task.id)}>
                          Save
                        </Button>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center flex-1">
                        <span className={`text-sm ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                          {task.content}
                        </span>
                        {onTaskEdit && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingTaskId(task.id);
                              setEditedTaskContent(task.content);
                            }}
                          >
                            <PenLine className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                {isAddingTask ? (
                  <div className="flex gap-2 mt-2">
                    <Input
                      placeholder="Enter new task..."
                      value={newTaskContent}
                      onChange={(e) => setNewTaskContent(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleTaskAdd()}
                    />
                    <Button size="sm" onClick={handleTaskAdd}>Add</Button>
                  </div>
                ) : (
                  onTaskAdd && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2"
                      onClick={() => setIsAddingTask(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Task
                    </Button>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </Draggable>
  );
};