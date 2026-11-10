import { MovieCreateForm } from "./_components/movie-create-form";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function MovieCreatePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const roles =
    session.user.role?.split(",").map((role) => role.trim()) ?? [];

  if (!roles.includes("admin")) {
    redirect("/");
  }

  return (
    <div className="space-y-2 p-6">
      <h1 className="text-3xl font-bold">Create a movie</h1>
      <h2 className="text-xl font-semibold">
        Fill out the form below to create a new movie.
      </h2>

      <MovieCreateForm />
    </div>
  );
}