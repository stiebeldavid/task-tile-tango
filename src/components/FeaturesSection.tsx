import { Brain, CheckCircle2, Rocket, Magic } from "lucide-react";

export const FeaturesSection = () => {
  return (
    <section className="container mx-auto px-4 py-24">
      <div className="grid md:grid-cols-4 gap-8">
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
          <h3 className="text-xl font-semibold">Effortless Progress</h3>
          <p className="text-muted-foreground">
            Let our smart system organize and track your tasks automatically. Less stress, more getting things done.
          </p>
        </div>

        <div className="glass-card p-6 space-y-4 hover-scale">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Magic className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-semibold">Smart Automation</h3>
          <p className="text-muted-foreground">
            Automate your task management and project organization. Work smarter, not harder.
          </p>
        </div>

        <div className="glass-card p-6 space-y-4 hover-scale">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Rocket className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-semibold">Boost Results</h3>
          <p className="text-muted-foreground">
            Accomplish more with less effort through structured workflows and automated organization.
          </p>
        </div>
      </div>
    </section>
  );
};