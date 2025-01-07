import { useState, useEffect, useRef } from "react";
import { ProjectGrid } from "@/components/ProjectGrid";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ProjectHeader } from "@/components/ProjectHeader";
import { EmptyProjectsCard } from "@/components/EmptyProjectsCard";
import { useProjects } from "@/hooks/useProjects";
import { useTasks } from "@/hooks/useTasks";
import { useProjectPositions } from "@/hooks/useProjectPositions";
import { DeepWorkModal } from "@/components/DeepWorkModal";
import { Button } from "@/components/ui/button";
import { Play, ArrowRight, CheckCircle2, Brain, Rocket } from "lucide-react";
import { InfoModal } from "@/components/InfoModal";
import { Session } from "@supabase/supabase-js";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState("");
  const [isDeepWorkModalOpen, setIsDeepWorkModalOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [view, setView] = useState<"sign_in" | "sign_up">("sign_in");
  const authRef = useRef<HTMLDivElement>(null);
  
  const { projects, isLoading, createProject, updateProject, deleteProject } = useProjects();
  const { updateTask, createTask, updateTaskContent } = useTasks();
  const { updateProjectPositions } = useProjectPositions();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(projects);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    updateProjectPositions(items);
  };

  const handleCreateProject = () => {
    if (newProjectTitle.trim()) {
      createProject(newProjectTitle);
      setIsAddingProject(false);
      setNewProjectTitle("");
    }
  };

  const scrollToAuth = (signUpMode = false) => {
    if (signUpMode) {
      setView("sign_up");
    }
    authRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (session) {
  return (
    <div className="min-h-screen bg-background">
      <ProjectHeader onSignOut={handleSignOut} />
      <InfoModal />
      <main className="container mx-auto pb-24">
        {projects.length === 0 ? (
          <div className="p-6">
            <EmptyProjectsCard onAddProject={() => setIsAddingProject(true)} />
          </div>
        ) : (
          <ProjectGrid
            projects={projects}
            onDragEnd={handleDragEnd}
            onTaskToggle={(projectId, taskId) => {
              const project = projects.find(p => p.id === projectId);
              const task = project?.tasks.find(t => t.id === taskId);
              if (task) {
                updateTask({
                  projectId,
                  taskId,
                  completed: !task.completed,
                });
              }
            }}
            onProjectEdit={(id, title) => updateProject({ id, title })}
            onTaskAdd={(projectId, content) => createTask({ projectId, content })}
            onTaskEdit={(projectId, taskId, content) => updateTaskContent({ taskId, content })}
            onProjectDelete={deleteProject}
            isAddingProject={isAddingProject}
            newProjectTitle={newProjectTitle}
            onNewProjectTitleChange={setNewProjectTitle}
            onCreateProject={handleCreateProject}
            onAddProjectClick={() => setIsAddingProject(true)}
          />
        )}

        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
          <Button
            size="lg"
            onClick={() => setIsDeepWorkModalOpen(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all group px-8 py-6"
          >
            <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
            Start Deep Work
          </Button>
        </div>

        <DeepWorkModal
          isOpen={isDeepWorkModalOpen}
          onClose={() => setIsDeepWorkModalOpen(false)}
          projects={projects}
        />
      </main>
    </div>
  );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="container mx-auto py-6 px-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          DailyDeepWork.com
        </h1>
        <Button onClick={() => scrollToAuth()} variant="outline">
          Sign In
        </Button>
      </header>

      <main>
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-24 flex flex-col items-center text-center">
          <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
            <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Master Deep Work, Achieve More
            </h1>
            <p className="text-xl text-muted-foreground">
              Transform your productivity with focused deep work sessions. 
              Organize projects, track tasks, and accomplish your goals.
            </p>
            <Button 
              size="lg" 
              onClick={() => scrollToAuth(true)}
              className="group px-8 py-6 text-lg"
            >
              Get Started Free
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-24">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-card p-6 space-y-4 hover-scale">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Focus Intensely</h3>
              <p className="text-muted-foreground">
                Eliminate distractions and enter a state of deep focus with timed work sessions.
              </p>
            </div>

            <div className="glass-card p-6 space-y-4 hover-scale">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Track Progress</h3>
              <p className="text-muted-foreground">
                Organize tasks, monitor completion, and celebrate your achievements.
              </p>
            </div>

            <div className="glass-card p-6 space-y-4 hover-scale">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Rocket className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Boost Productivity</h3>
              <p className="text-muted-foreground">
                Accomplish more in less time with structured deep work sessions.
              </p>
            </div>
          </div>
        </section>

        {/* Auth Section */}
        <section ref={authRef} className="container mx-auto px-4 py-24">
          <div className="glass-card max-w-md mx-auto p-12 space-y-6">
            <h2 className="text-2xl font-bold text-center">
              {view === "sign_in" ? "Log in to your account" : "Create a new account"}
            </h2>
            <Auth
              supabaseClient={supabase}
              appearance={{ theme: ThemeSupa }}
              theme="dark"
              providers={[]}
              view={view}
              localization={{
                variables: {
                  sign_in: {
                    link_text: "Already have an account? Sign in",
                  },
                  sign_up: {
                    link_text: "Don't have an account? Sign up",
                  },
                },
              }}
            />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
