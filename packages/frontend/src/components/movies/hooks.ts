"use client";
import { useApiCall } from "@/components/hooks";
import { Movie } from "./types";
import { useState } from "react";
import { useForm } from "react-hook-form";

const setMovieLiked = ({
  movieId,
  movies,
  setMovies,
  likes,
  setLikes,
  increment,
}: {
  movieId: string;
  movies: Movie[];
  setMovies: (movies: Movie[]) => void;
  likes: Record<string, boolean>;
  setLikes: (likes: Record<string, boolean>) => void;
  increment: number;
}) => {
  const mappedMovies = movies.map((movie) => {
    if (movie.id === movieId) {
      return {
        ...movie,
        likes: movie.likes + increment,
      };
    }
    return movie;
  });
  setMovies(mappedMovies);
  setLikes({ ...likes, [movieId]: increment > 0 });
};

export const useMovies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const {
    callApi: callApiGetMovies,
    data = [],
    error,
    loading,
  } = useApiCall<Movie[]>("/movies", "GET");
  const { callApi: callApiLikeMovie } = useApiCall<Movie[]>("/movies", "PUT");
  const { callApi: callApiAddMovie } = useApiCall<Movie[]>("/movies", "POST");
  const [likes, setLikes] = useState<Record<string, boolean>>({});

  const listMovies = async (options: {
    limit?: number;
    offset?: number;
    title?: string;
    orderBy: { [K in "title" | "createdAt"]?: "asc" | "desc" };
  }) => {
    const response = await callApiGetMovies(options);
    setMovies(response?.data || []);
  };

  const toggleMovieLike = async (movieId: string) => {
    const movie = movies.find((movie) => movie.id === movieId);
    const increment = movie?.meLiked ? -1 : 1;
    setMovieLiked({
      movieId,
      movies,
      setMovies,
      likes,
      setLikes,
      increment,
    });
    const { error } = await callApiLikeMovie({}, `/${movieId}/toggle/like`);
    if (error) {
      setMovieLiked({
        movieId,
        movies,
        setMovies,
        likes,
        setLikes,
        increment: -increment,
      });
    }
    await listMovies({ orderBy: { createdAt: "desc" } });
  };

  const addMovie = async ({ title }: { title: string }) => {
    if (!title) return;
    const newMovie = {
      id: Math.random().toString(),
      title,
      createdAt: new Date(),
      likes: 0,
      meLiked: false,
    };
    setMovies([newMovie, ...movies]);
    const { error } = await callApiAddMovie({ title });
    if (error) {
      setMovies(movies.filter((movie) => movie.id !== newMovie.id));
    }
    await listMovies({ orderBy: { createdAt: "desc" } });
  };

  return { addMovie, listMovies, toggleMovieLike, movies, error, loading };
};
