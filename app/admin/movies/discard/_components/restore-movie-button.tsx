
import { Button } from "@/components/ui/button";
import { restoreMovie } from "../../[movieId]/_components/delete-action";


export default function RestoreMovieButton({
  movieId,
}: {
  movieId: string;
}) {

  // prepares a function that will eventually call "restoreMovie("movie123"); (this is an example)
  return (
    <form action={restoreMovie.bind(null, movieId)}>
      <Button type="submit" variant="outline">
        Restore Movie
      </Button>
    </form>
  );
}
