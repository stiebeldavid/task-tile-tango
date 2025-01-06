import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Info } from "lucide-react";

export const InfoModal = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="fixed top-24 right-6 z-50 p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors group">
          <Info className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] glass-card">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            DailyDeepWork.com
          </DialogTitle>
          <p className="text-lg text-muted-foreground mt-1">How It Works</p>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-primary">Organize Your Work</h3>
            <p className="text-muted-foreground">
              Create projects, add your ideas, and break them down into manageable tasks - all in one place.
            </p>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-primary">Stay Focused</h3>
            <p className="text-muted-foreground">
              Start deep work sessions to concentrate on up to three important tasks at a time.
            </p>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-primary">Get Things Done</h3>
            <p className="text-muted-foreground">
              Track your progress, maintain focus, and accomplish your goals with dedicated deep work sessions.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
            <p className="text-sm text-muted-foreground italic">
              "The ability to perform deep work is becoming increasingly rare at exactly the same time it is becoming increasingly valuable in our economy." - Cal Newport
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};