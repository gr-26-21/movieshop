"use client";

import { importPopularMovies } from "@/actions/tmdb-button-action";
import { useState } from "react";


export default function TMDBImportButton() {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);

    try {
      await importPopularMovies();
      alert("Movie import finished!");
    } catch (error) {
      console.error(error);
      alert("Failed to import popular movies.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button onClick={handleClick} disabled={loading}>
      {loading ? "Importing movies..." : "Import Popular Movies"}
    </button>
  );
}