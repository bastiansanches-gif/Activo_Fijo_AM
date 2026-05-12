import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top_left,hsl(var(--accent)),transparent_35%),hsl(var(--background))] p-4">
      <LoginForm />
    </main>
  );
}
