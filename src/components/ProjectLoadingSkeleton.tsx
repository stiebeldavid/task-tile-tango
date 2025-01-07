import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const ProjectLoadingSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="glass-card h-full border border-border/50 shadow-lg animate-pulse">
          <CardHeader className="flex flex-row items-center space-x-4">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex gap-2 mb-4">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-16" />
              </div>
              <div className="space-y-2">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 flex-1" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};