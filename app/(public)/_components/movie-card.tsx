import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import Image from "next/image";
import errorImg from "@/public/404.png";

export default function MovieCard({
  title,
  price,
  releaseDate,
  imgURL,
}: {
  title: string;
  price: number;
  releaseDate: number;
  imgURL: string | null;
}) {
  return (
    <Card className="p-0 pb-6">
      <CardHeader className="relative h-100 w-full overflow-hidden rounded-t-lg p-0">
        <Image
          src={imgURL || errorImg}
          alt={title}
          fill
          className="object-cover"
        />
      </CardHeader>

      <CardContent>
        <CardTitle>{title}</CardTitle>

        <CardDescription>Released: {releaseDate}</CardDescription>

        <CardDescription>${price}</CardDescription>
      </CardContent>

      <CardFooter>
        <Button className="w-full">Add to Cart</Button>
      </CardFooter>
    </Card>
  );
}
