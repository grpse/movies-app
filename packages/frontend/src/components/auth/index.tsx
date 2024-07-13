'use client';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useEffect, useState } from 'react';

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
    <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSignup)}>
      <div className="flex flex-col">
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
        disabled={isSubmitting || loading}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
      >
        Signup
      </button>
      {error && <p className="mt-2 text-red-500">{error}</p>}
    </form>
  );
};
