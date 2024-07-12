'use client';
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";

type Movie = {
  id: string;
  title: string;
  _count: {
    reactions: number;
  }
}

export default function Movies() {
  const [movies, setMovies] = useState<Array<Movie>>([]);

  useEffect(() => {
    axios.get('/api/movies').then((response) => setMovies(response.data.data));
  }, []);

  return (
    <main className="flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">Movies</h1>
      <ul className="mt-4 flex flex-col items-center justify-center border border-solid border-gray-300 rounded-md">
        {movies.map(movie => (
          <li key={movie.id} className="mb-4">
            <span>{movie.title}</span>
            <span>likes: {movie._count.reactions}</span>
          </li>
        ))}
      </ul>
    </main>
  );
}
