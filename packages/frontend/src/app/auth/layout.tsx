'use client';

import { usePathname } from 'next/navigation'
import Link from "next/link";
import { PropsWithChildren } from "react";

export default function AuthPage({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/auth/login';

  return (
    <div className="flex items-center justify-center w-full h-full px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white rounded-lg p-10 shadow-lg">
        {children}
        <div className="flex flex-row gap-2 justify-center text-gray-700 dark:text-gray-900">
          {isLoginPage ? (
            <>
              <p className="underline"><Link href="/auth/signup">signup</Link></p> or
              <p>login</p>
            </>
          ) : (
            <>
              <p>signup</p> or
              <p className="underline"><Link href="/auth/login">login</Link></p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
