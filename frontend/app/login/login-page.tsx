import Image from "next/image";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#F5F8FF] p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex justify-center">
          <Image src="/logos/logo-audiomusica.svg" alt="Audiomusica" width={220} height={56} priority />
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
