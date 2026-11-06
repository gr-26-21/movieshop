import { Button } from "@/components/ui/button";
import { softDeleteMovie } from "./delete-action";

export default function SoftDeleteMovieButton({
  movieId,
}: {
  movieId: string;
}) {
  return (
    //softDeleteMovie will mark a movie as deleted in DB
    //.bind(null, movieId) pre-passes movieId to know what movie to delete 
    // when form submitted, it calls softDeleteMovie and give it the movieId input (e.g. movieId= "movie123")
    <form action={softDeleteMovie.bind(null, movieId)}>
      <Button
        type="submit"
        variant="destructive"
        size="lg"
      >
        Delete Movie
      </Button>
    </form>
  );
}