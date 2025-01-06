import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Play, ChevronRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Task {
  id: string;
  content: string;
  completed: boolean;
}

interface Project {
  id: string;
  title: string;
  tasks: Task[];
}

interface DeepWorkModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
}

export const DeepWorkModal = ({ isOpen, onClose, projects }: DeepWorkModalProps) => {
  const [step, setStep] = useState<'project' | 'duration'>('project');
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [duration, setDuration] = useState<string | null>(null);

  const handleTaskToggle = (taskId: string) => {
    setSelectedTasks(prev => {
      if (prev.includes(taskId)) {
        return prev.filter(id => id !== taskId);
      }
      if (prev.length >= 3) {
        return prev;
      }
      return [...prev, taskId];
    });
  };

  const handleNext = () => {
    if (step === 'project' && selectedTasks.length > 0) {
      setStep('duration');
    } else if (step === 'duration' && duration) {
      // Here you would handle starting the deep work session
      console.log('Starting deep work session:', {
        taskIds: selectedTasks,
        duration
      });
      onClose();
      resetModal();
    }
  };

  const resetModal = () => {
    setStep('project');
    setSelectedTasks([]);
    setDuration(null);
  };

  const handleClose = () => {
    onClose();
    resetModal();
  };

  const durations = [
    { value: '30', label: '30 minutes' },
    { value: '45', label: '45 minutes' },
    { value: '60', label: '60 minutes' },
    { value: '90', label: '90 minutes' },
    { value: '120', label: '2 hours' },
    { value: '180', label: '3 hours' },
    { value: '240', label: '4 hours' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === 'project' ? 'Select Tasks' : 'Set Duration'}
          </DialogTitle>
        </DialogHeader>

        {step === 'project' ? (
          <div className="space-y-4">
            <Accordion type="multiple" className="w-full">
              {projects.map(project => (
                <AccordionItem value={project.id} key={project.id}>
                  <AccordionTrigger className="text-sm hover:no-underline">
                    {project.title}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 pt-2">
                      {project.tasks
                        .filter(task => !task.completed)
                        .map(task => (
                          <div
                            key={task.id}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={task.id}
                              checked={selectedTasks.includes(task.id)}
                              onCheckedChange={() => handleTaskToggle(task.id)}
                              disabled={
                                !selectedTasks.includes(task.id) &&
                                selectedTasks.length >= 3
                              }
                            />
                            <label
                              htmlFor={task.id}
                              className="text-sm cursor-pointer"
                            >
                              {task.content}
                            </label>
                          </div>
                        ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="flex justify-end mt-4">
              <Button
                onClick={handleNext}
                disabled={selectedTasks.length === 0}
                className="bg-primary/20 hover:bg-primary/40 text-primary-foreground"
              >
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <>
            <RadioGroup
              value={duration}
              onValueChange={setDuration}
              className="grid gap-4"
            >
              {durations.map(({ value, label }) => (
                <div key={value} className="flex items-center space-x-2">
                  <RadioGroupItem value={value} id={`duration-${value}`} />
                  <Label htmlFor={`duration-${value}`}>{label}</Label>
                </div>
              ))}
            </RadioGroup>

            <div className="flex justify-end mt-4">
              <Button
                onClick={handleNext}
                disabled={!duration}
                className="bg-primary/20 hover:bg-primary/40 text-primary-foreground"
              >
                Start
                <Play className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};