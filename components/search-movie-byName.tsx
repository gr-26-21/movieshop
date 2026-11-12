import { Input } from "@/components/ui/input";

export default function SearchMovieByName() {
  return (
    <>
      <form action={"/movies"}>
        <Input
          placeholder="search movie"
          className="px-5"
          name="search"
          defaultValue={""}
        />
      </form>
    </>
  );
}
