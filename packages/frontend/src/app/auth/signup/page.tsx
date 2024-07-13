'use client';

import React from 'react';
import { SignupForm } from '@/components/components/auth';
import { useSignup } from '@/components/components/auth/hooks';


export default function SignupPage() {
  const signupState = useSignup();
  return <SignupForm {...signupState} />;
}