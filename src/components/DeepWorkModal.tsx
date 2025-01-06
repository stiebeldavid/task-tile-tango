import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Play, ChevronRight, AlertCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  const navigate = useNavigate();
  const [step, setStep] = useState<'project' | 'duration'>('project');
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [duration, setDuration] = useState<string | null>(null);
  const [showPrepModal, setShowPrepModal] = useState(false);

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
      setShowPrepModal(true);
    }
  };

  const startDeepWork = () => {
    setShowPrepModal(false);
    onClose();
    navigate("/deep-work", {
      state: {
        selectedTasks,
        duration: parseInt(duration!),
        projects
      }
    });
    resetModal();
  };

  const resetModal = () => {
    setStep('project');
    setSelectedTasks([]);
    setDuration(null);
    setShowPrepModal(false);
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

  const defaultExpandedValue = projects.length > 0 ? [projects[0].id] : [];

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {step === 'project' ? 'Select Tasks for Deep Work Session' : 'Set Duration for Deep Work'}
            </DialogTitle>
          </DialogHeader>

          {step === 'project' ? (
            <div className="space-y-4">
              <Accordion type="multiple" defaultValue={defaultExpandedValue} className="w-full">
                {projects.map(project => (
                  <AccordionItem value={project.id} key={project.id}>
                    <AccordionTrigger className="text-sm hover:no-underline flex flex-row-reverse justify-end gap-2">
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
              <div className="grid grid-cols-2 gap-3">
                {durations.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => setDuration(value)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      duration === value
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="text-sm font-medium">{label}</div>
                  </button>
                ))}
              </div>

              <div className="flex justify-end mt-4">
                <Button
                  onClick={handleNext}
                  disabled={!duration}
                  className="bg-primary/20 hover:bg-primary/40 text-primary-foreground"
                >
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={showPrepModal} onOpenChange={setShowPrepModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              Prepare for Deep Work
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <p>Before starting your deep work session, ensure you:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Turn off all notifications on your devices</li>
                <li>Close distracting applications and browser tabs</li>
                <li>Clear your desk of unnecessary items</li>
                <li>Have water or other necessities within reach</li>
                <li>Use the bathroom if needed</li>
                <li>Let others know you'll be unavailable</li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              onClick={startDeepWork}
              className="w-full bg-primary/20 hover:bg-primary/40 text-primary-foreground"
            >
              Start Deep Work
              <Play className="ml-2 h-4 w-4" />
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};