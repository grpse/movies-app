'use client';
import { AuthMakerRouterIndication, SignupForm } from "@/components/components/auth";
import { useSignup } from "@/components/components/auth/hooks";

export default function SignupPage() {

  const signupState = useSignup();

  return (
    <div>
      <SignupForm {...signupState} />
      <AuthMakerRouterIndication />
    </div>
  );
}
