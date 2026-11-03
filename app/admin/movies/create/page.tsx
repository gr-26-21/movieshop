import { MovieCreateForm } from "./_components/movie-create-form";

export default function MovieCreatePage() {
  return (
    <div className="space-y-2 p-6">
      <h1 className="text-3xl font-bold">Create a movie</h1>
      <h2 className="text-xl font-semibold">Fill out the form below to create a new movie.</h2>
        <br />
      <MovieCreateForm />
    </div>
  );
}
