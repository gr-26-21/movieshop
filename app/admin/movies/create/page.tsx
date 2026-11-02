import { MovieCreateForm } from "./_components/movie-create-form";

export default function MovieCreatePage() {
  return (
    <div className="space-y-2 p-6">
      <h1 className="text-3xl font-bold">Create Movie</h1>

      <MovieCreateForm />
    </div>
  );
}
