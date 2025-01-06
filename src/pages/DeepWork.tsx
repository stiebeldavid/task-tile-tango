import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Timer, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTasks } from "@/hooks/useTasks";

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

interface DeepWorkState {
  selectedTasks: string[];
  duration: number;
  projects: Project[];
}

const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0 || hours > 0) parts.push(`${minutes}m`);
  parts.push(`${remainingSeconds}s`);

  return parts.join(" ");
};

const DeepWork = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { updateTask } = useTasks();
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [sessionData, setSessionData] = useState<DeepWorkState | null>(null);

  useEffect(() => {
    const state = location.state as DeepWorkState;
    if (!state) {
      navigate("/");
      return;
    }
    setSessionData(state);
    setTimeLeft(state.duration * 60);
  }, [location.state, navigate]);

  useEffect(() => {
    if (!isActive || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsActive(false);
          toast({
            title: "Deep Work Session Complete",
            description: "Great job! Your session has ended.",
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, timeLeft, toast]);

  const handleTaskToggle = (taskId: string) => {
    if (!sessionData) return;
    
    const projectId = sessionData.projects.find(project => 
      project.tasks.some(task => task.id === taskId)
    )?.id;

    if (projectId) {
      updateTask({ projectId, taskId, completed: true });
    }
  };

  const endSession = () => {
    setIsActive(false);
    navigate("/");
  };

  if (!sessionData) return null;

  const relevantProjects = sessionData.projects.filter(project =>
    project.tasks.some(task => sessionData.selectedTasks.includes(task.id))
  );

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <Card className="border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center space-x-4">
              <Timer className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Deep Work Session
              </h1>
            </div>
            <div className="text-xl font-mono font-bold text-primary">
              {formatTime(timeLeft)}
            </div>
          </CardHeader>
        </Card>

        {relevantProjects.map((project) => (
          <Card key={project.id} className="border-primary/10">
            <CardHeader>
              <h2 className="text-lg font-semibold text-primary/80">{project.title}</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              {project.tasks
                .filter((task) => sessionData.selectedTasks.includes(task.id))
                .map((task) => (
                  <div key={task.id} className="flex items-center space-x-3">
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => handleTaskToggle(task.id)}
                      className="border-primary/50 data-[state=checked]:bg-primary/50"
                    />
                    <span className={task.completed ? "line-through text-muted-foreground" : ""}>
                      {task.content}
                    </span>
                  </div>
                ))}
            </CardContent>
          </Card>
        ))}

        <Button
          onClick={endSession}
          variant="ghost"
          className="w-full mt-6 border border-destructive/50 hover:bg-destructive/10 text-destructive"
        >
          <X className="h-4 w-4 mr-2" />
          End Session
        </Button>
      </div>
    </div>
  );
};

export default DeepWork;