'use client';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useRouter as useRouterNext } from 'next/router';
import Link from 'next/link';

export const LoginForm = ({
  onLogin,
  error,
  loading,
}: {
  onLogin: (data: { username: string; password: string }) => Promise<void>;
  error: string | null;
  loading: boolean;
}) => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = useForm<{ username: string; password: string }>();

  return (
    <form className="flex flex-col gap-2" onSubmit={handleSubmit(onLogin)}>
      <div className="flex flex-col flex-grow">
        <label className=" text-gray-700 dark:text-gray-900">
          Username:
        </label>
        <input
          className="border border-gray-300 p-2 mt-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300"
          {...register('username', { required: 'Username is required' })}
          autoComplete="username"
        />
      </div>
      <div className="flex flex-col">
        <label className=" text-gray-700 dark:text-gray-900">
          Password:
        </label>
        <input
          className="border border-gray-300 p-2 mt-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300"
          {...register('password', { required: 'Password is required' })}
          autoComplete="current-password"
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting || !isValid || loading}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
      >
        Login
      </button>
      {error && <p className="mt-2 text-red-500">{error}</p>}
    </form>
  );
};

export const SignupForm = ({
  onSignup,
  error,
  loading,
}: {
  onSignup: (data: { username: string; password: string }) => Promise<void>;
  error: string | null;
  loading: boolean;
}) => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = useForm<{ username: string; password: string }>();

  return (
    <form onSubmit={handleSubmit(onSignup)}>
      <label>
        Username:
        <input {...register('username', { required: 'Username is required' })} autoComplete="username" />
      </label>
      <label>
        Password:
        <input {...register('password', { required: 'Password is required' })} autoComplete="current-password" />
      </label>
      <button type="submit" disabled={isSubmitting || !isValid || loading}>Signup</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
};


export const AuthMakerRouterIndication = () => {
  const { pathname } = window.location;
  const isSignup = pathname === '/auth/signup';
  const isLogin = pathname === '/auth/login';

  return (
    <div className="flex flex-row gap-2 justify-center text-gray-700 dark:text-gray-900">
      {isSignup ? <p>signup</p> : <p className="underline"><Link href="/auth/signup">signup</Link></p>}
      or
      {isLogin ? <p>login</p> : <p className="underline"><Link href="/auth/login">login</Link></p>}
    </div>
  );
};
