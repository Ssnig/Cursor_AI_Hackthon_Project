import { FormEvent, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFoodLoop } from "@/context/FoodLoopContext";
import { DEMO_CREDENTIALS } from "@/lib/foodloop";

export default function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated, authReady, error } = useFoodLoop();
  const [email, setEmail] = useState(DEMO_CREDENTIALS.email);
  const [password, setPassword] = useState(DEMO_CREDENTIALS.password);
  const [localError, setLocalError] = useState<string | null>(null);

  if (authReady && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLocalError(null);
    try {
      login(email, password);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : String(err));
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md border-none shadow-xl shadow-primary/10">
        <CardHeader className="gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <Leaf className="h-6 w-6" />
            </div>
            <div>
              <p className="text-lg font-black tracking-tight">FoodLoop</p>
              <p className="text-xs text-muted-foreground">Restaurant owner login</p>
            </div>
          </div>
          <CardTitle>Sign in to your restaurant</CardTitle>
          <p className="text-sm text-muted-foreground">
            Demo account prefilled:{" "}
            <span className="font-semibold text-foreground">
              {DEMO_CREDENTIALS.email} / {DEMO_CREDENTIALS.password}
            </span>
          </p>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <label className="grid gap-2 text-sm font-semibold">
              Email
              <input
                className="h-11 rounded-2xl border bg-background px-4 outline-none focus:ring-2 focus:ring-ring"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                required
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              Password
              <input
                className="h-11 rounded-2xl border bg-background px-4 outline-none focus:ring-2 focus:ring-ring"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </label>
            {localError || error ? (
              <p className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {localError || error}
              </p>
            ) : null}
            <Button type="submit" className="w-full">
              Enter restaurant dashboard
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            New restaurant?{" "}
            <Link className="font-semibold text-primary hover:underline" to="/signup">
              Create an account
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
