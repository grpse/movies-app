'use client';

import { LoginForm } from "@/components/components/auth";
import { useLogin } from "@/components/components/auth/hooks";

export default function LoginPage() {
  const loginState = useLogin();
  return <LoginForm {...loginState} />;
}