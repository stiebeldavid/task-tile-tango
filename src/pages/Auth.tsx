import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [view, setView] = useState<"sign_in" | "sign_up">("sign_in");

  // Set initial view based on URL parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("mode") === "sign_up") {
      setView("sign_up");
    }
  }, [location]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            DailyDeepWork.com
          </h1>
          <h2 className="text-xl font-semibold">
            {view === "sign_up" ? "Create an Account" : "Welcome Back"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {view === "sign_up" 
              ? "Start your journey to better productivity"
              : "Sign in to continue your productivity journey"}
          </p>
        </div>
        
        <Auth
          supabaseClient={supabase}
          appearance={{ 
            theme: ThemeSupa,
            style: {
              button: { background: 'hsl(var(--primary))', color: 'white' },
              anchor: { color: 'hsl(var(--primary))' },
            }
          }}
          theme="light"
          providers={[]}
          view={view}
          viewChange={({ view }) => setView(view as "sign_in" | "sign_up")}
        />
      </div>
    </div>
  );
};

export default AuthPage;