'use client';

import Movies from "../components/movies";
import { useLoggedSession } from "../hooks";


export default function Main() {
  const { isLoggedIn, logout } = useLoggedSession();

  if (!isLoggedIn) {
    if (typeof window !== 'undefined') {
      window.location.pathname = '/auth/login';
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-2 pt-24">
      <div className="absolute top-0 right-0 p-4">
        <button onClick={logout} className="bg-red-500 text-white py-2 px-4 rounded">Logout</button>
      </div>
      <Movies />
    </main>
  );
}
