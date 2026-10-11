import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export interface LoginDialogProps {
  mode: "signin" | "signup" | "forgot";
  onModeChange: (mode: "signin" | "signup" | "forgot") => void;
  onClose: () => void;
}

export function LoginDialog({ mode, onModeChange, onClose }: LoginDialogProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (mode === "signin") {
      toast.success("Sign in successful! (Demo)");
      onClose();
    } else if (mode === "signup") {
      if (password !== confirmPassword) {
        toast.error("Passwords do not match.");
        return;
      }
      toast.success("Account created successfully! (Demo)");
      onClose();
    } else if (mode === "forgot") {
      toast.success("Password reset link sent to " + email);
      onModeChange("signin");
    }
  };

  const handleGoogleLogin = () => {
    toast.info("Google login will be connected soon.");
  };

  return (
    <DialogContent className="max-w-md border-border bg-background">
      <DialogHeader>
        <DialogTitle className="font-display text-3xl font-black">
          {mode === "signin"
            ? "Welcome back."
            : mode === "signup"
              ? "Create your account."
              : "Forgot password?"}
        </DialogTitle>

        <DialogDescription>
          {mode === "signin"
            ? "Sign in to manage your tickets and events."
            : mode === "signup"
              ? "Create your VibePass account in a few seconds."
              : "Enter your email and we'll send you a reset link."}
        </DialogDescription>
      </DialogHeader>

      {mode === "forgot" ? (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block text-sm font-semibold">
            Email address
            <Input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2"
              placeholder="you@example.com"
            />
          </label>

          <Button className="w-full" size="lg" type="submit">
            Send reset link
          </Button>

          <button
            type="button"
            onClick={() => onModeChange("signin")}
            className="w-full text-center text-sm font-semibold text-primary hover:underline"
          >
            ← Back to Sign in
          </button>
        </form>
      ) : (
        <>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {mode === "signup" && (
              <label className="block text-sm font-semibold">
                Full name
                <Input
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-2"
                  placeholder="Your name"
                />
              </label>
            )}

            <label className="block text-sm font-semibold">
              Email address
              <Input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2"
                placeholder="you@example.com"
              />
            </label>

            <label className="block text-sm font-semibold">
              Password
              <Input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2"
                placeholder="••••••••"
              />
            </label>

            {mode === "signup" && (
              <label className="block text-sm font-semibold">
                Confirm password
                <Input
                  required
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-2"
                  placeholder="••••••••"
                />
              </label>
            )}

            {mode === "signin" && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => onModeChange("forgot")}
                  className="text-sm font-semibold text-primary hover:underline"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <Button className="w-full" size="lg" type="submit">
              {mode === "signin" ? "Sign in" : "Create account"}
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs font-semibold text-muted-foreground">
              OR
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            size="lg"
            onClick={handleGoogleLogin}
          >
            <span className="font-bold text-lg">G</span>
            Continue with Google
          </Button>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "signin" ? (
              <>
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => onModeChange("signup")}
                  className="font-bold text-primary hover:underline"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => onModeChange("signin")}
                  className="font-bold text-primary hover:underline"
                >
                  Sign in
                </button>
              </>
            )}
          </div>
        </>
      )}
    </DialogContent>
  );
}

