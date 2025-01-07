import { Alert, AlertDescription } from "@/components/ui/alert";
import { AuthError } from "@supabase/supabase-js";

interface AuthErrorProps {
  error: AuthError | null;
}

export const AuthError = ({ error }: AuthErrorProps) => {
  if (!error) return null;

  const getErrorMessage = (error: AuthError) => {
    switch (error.message) {
      case "Invalid login credentials":
        return "Invalid email or password. Please check your credentials and try again.";
      case "Email not confirmed":
        return "Please verify your email address before signing in.";
      default:
        return error.message;
    }
  };

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertDescription>{getErrorMessage(error)}</AlertDescription>
    </Alert>
  );
};