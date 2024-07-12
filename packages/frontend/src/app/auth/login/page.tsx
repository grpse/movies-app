'use client';
import { AuthMakerRouterIndication, LoginForm } from "@/components/components/auth";
import { useLogin } from "@/components/components/auth/hooks";

export default function LoginPage() {

  const loginState = useLogin();

  return (
    <div className="flex items-center justify-center w-full h-full px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white rounded-lg p-10 shadow-lg">
        <LoginForm {...loginState} />
        <AuthMakerRouterIndication />
      </div>
    </div>
  );
}
