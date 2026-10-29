/**
 * Filminformation som används i kundvagnen.
 *
 * Filmens ID kommer från gruppens databas.
 */
export type Product = {
  id: string;
  title: string;
  price: number;
  description: string;
  imageUrl: string | null;
};
