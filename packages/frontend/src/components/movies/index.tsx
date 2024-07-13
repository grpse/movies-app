'use client';

import React, { useEffect, useState } from "react";
import { useMovies } from "./hooks";
import LikedIcon from "./liked-icon";
import { useForm } from "react-hook-form";

export default function Movies() {
  const { addMovie, listMovies, toggleMovieLike, movies, loading, error } = useMovies();
  const { register, handleSubmit, resetField} = useForm<{ title: string }>()

  const onSubmit = (data: { title: string }) => {
    addMovie(data);
    resetField("title");
  }

  useEffect(() => {
    listMovies({ limit: 10, offset: 0, title: "", orderBy: { createdAt: "desc" } });
  }, []);

  return (
    <main className="flex flex-col items-center justify-center w-full gap-4">
      <h1 className="text-4xl font-bold">Movies</h1>
      <div className="flex flex-col flex-nowrap gap-2 w-full">
        {movies?.map(movie => (
          <div key={movie.id} className="flex flex-row gap-2 justify-between p-2 w-full h-fit rounded-sm border-solid border-gray-300">
            <span>{movie.title}</span>
            <span className="flex items-center gap-1">
              <button onClick={() => toggleMovieLike(movie.id)}>
                <LikedIcon className={`hover:fill-pink-500 ${movie.likes > 1 ? "fill-pink-100" : ""} ${movie.likes === 0 ? "fill-gray-300" : "fill-pink-600"}`} />
              </button>
              {movie.likes}
            </span>
          </div>
        ))}
      </div>
      <div className="w-full px-4">
        <h3>Add movie</h3>
        <form className="flex flex-row gap-2 w-full" onSubmit={handleSubmit(onSubmit)}>
          <input
            type="text"
            placeholder="Title"
            className="w-full p-2 rounded-sm border-solid border-gray-300 text-gray-700 dark:text-gray-300"
            {...register("title")}
          />
          <button>Add</button>
        </form>
      </div>
    </main>
  );
}
