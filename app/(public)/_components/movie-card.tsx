import { buttonVariants } from "@/components/ui/button";
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

// A component for displaying a movie in a card layout
export default function MovieCard({
  title,
  price,
  releaseDate,
  imgURL,
  actions,
  outOfStock = false,
}: {
  title: string;
  price: number;
  releaseDate: number;
  imgURL: string | null;
  actions?: React.ReactNode;
  outOfStock?: boolean;
}) {
  return (
    <Card className="p-0 pb-6">
      <CardHeader className="relative h-100 w-full overflow-hidden rounded-t-lg p-0">
        <Image
          src={imgURL || errorImg}
          alt={title}
          fill
          className={
            outOfStock ? "object-cover opacity-60 grayscale" : "object-cover"
          }
        />
        {outOfStock && (
          <span className="absolute top-3 right-3 z-10 rounded-full bg-black/80 px-3 py-1 text-xs font-semibold text-white">
            Out of stock
          </span>
        )}
      </CardHeader>

      <CardContent>
        <CardTitle>{title}</CardTitle>

        <CardDescription>Released: {releaseDate}</CardDescription>

        <CardDescription>{price} kr</CardDescription>
      </CardContent>

      <CardFooter className="mt-auto">
        {actions ?? (
          <Link href="/cart" className={`w-full ${buttonVariants()}`}>
            Add to Cart
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}
