import { Button, buttonVariants } from "@/components/ui/button";
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
import Link from "next/link";

export default function MovieCard({
  title,
  price,
  releaseDate,
  imgURL,
  actions,
}: {
  title: string;
  price: number;
  releaseDate: number;
  imgURL: string | null;
  actions?: React.ReactNode;
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
        <Link href={"/cart"} className={`w-full ${buttonVariants()}`}>
          Add to Cart
        </Link>
      </CardFooter>
    </Card>
  );
}
