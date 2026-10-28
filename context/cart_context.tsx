"use client";

import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { Product } from "@/types/product";

/**
 * En produkt i varukorgen tillsammans med antalet.
 */
export type CartItem = Product & {
  quantity: number;
};

/**
 * Formatet som sparas i webbläsarens cookie.
 * Endast produkt-ID och antal lagras.
 */
type StoredCartItem = {
  id: string;
  quantity: number;
};

/**
 * Funktioner och data som delas genom CartContext.
 */
type CartContextType = {
  cart: CartItem[];
  isLoaded: boolean;
  loadError: string | null;
  addToCart: (product: Product) => void;
  increaseQuantity: (productId: string) => void;
  decreaseQuantity: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

type CartProviderProps = {
  children: ReactNode;
};

/**
 * Läser och validerar sparade produkter från cookien.
 *
 * Produktinformationen ska hämtas från gruppens databas.
 * Okända produkt-ID:n och ogiltiga antal ignoreras.
 *
 * @param cookieValue - Det avkodade cookieinnehållet.
 * @returns En återskapad varukorg.
 */
function restoreCart(cookieValue: string): StoredCartItem[] {
  try {
    const parsed: unknown = JSON.parse(cookieValue);

    if (!Array.isArray(parsed)) return [];

    const quantities = new Map<string, number>();

    for (const item of parsed) {
      if (
        typeof item !== "object" ||
        item === null ||
        !("id" in item) ||
        !("quantity" in item)
      ) {
        continue;
      }

      const { id, quantity } = item;

      if (
        typeof id !== "string" ||
        id.trim().length === 0 ||
        typeof quantity !== "number" ||
        !Number.isSafeInteger(quantity) ||
        quantity < 1
      ) {
        continue;
      }

      // Slå samman eventuella dubbletter.
      const total = (quantities.get(id) ?? 0) + quantity;

      if (Number.isSafeInteger(total)) {
        quantities.set(id, total);
      }
    }

    // Returnera endast validerade film-ID:n och antal.
    // Aktuella filmuppgifter hämtas senare från API:et.
    return Array.from(quantities, ([id, quantity]) => ({
      id,
      quantity,
    }));
  } catch {
    // Ogiltig JSON ger en tom varukorg.
    return [];
  }
}

/**
 * Delar varukorgens innehåll och funktioner med
 * underliggande komponenter.
 */
export function CartProvider({ children }: CartProviderProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  /**
   * Läser cookien när komponenten monteras.
   * Återskapar varukorgen från den lokala produktlistan.
   */

  useEffect(() => {
    let cancelled = false;

    async function loadCart() {
      try {
        const cookie = document.cookie
          .split("; ")
          .find((row) => row.startsWith("cart="));

        if (!cookie) {
          if (!cancelled) setIsLoaded(true);
          return;
        }

        const cookieValue = decodeURIComponent(cookie.substring(5));
        const savedItems = restoreCart(cookieValue);

        if (savedItems.length === 0) {
          if (!cancelled) setIsLoaded(true);
          return;
        }

        const params = new URLSearchParams();

        for (const item of savedItems) {
          params.append("ids", item.id);
        }

        const response = await fetch(`/api/cart?${params.toString()}`);

        if (!response.ok) {
          throw new Error("Kunde inte hämta filmerna.");
        }

        const movies: Product[] = await response.json();

        const restoredCart: CartItem[] = movies.flatMap((movie) => {
          const saved = savedItems.find((item) => item.id === movie.id);

          return saved ? [{ ...movie, quantity: saved.quantity }] : [];
        });

        if (!cancelled) {
          setCart(restoredCart);
          setIsLoaded(true);
        }
      } catch (error) {
        console.error("Kunde inte återställa varukorgen:", error);

        if (!cancelled) {
          setLoadError(
            "We couldn't load your shopping cart. Please reload the page."
          );
        }
      }
    }

    void loadCart();

    return () => {
      cancelled = true;
    };
  }, []);

  /**
   * Sparar enbart produkt-ID och antal.
   *
   * Cookien gäller i sju dagar och används
   * på samtliga sidor i applikationen.
   */
  useEffect(() => {
    if (!isLoaded) return;

    const storedCart: StoredCartItem[] = cart.map(({ id, quantity }) => ({
      id,
      quantity,
    }));

    const cartData = encodeURIComponent(JSON.stringify(storedCart));

    document.cookie = `cart=${cartData}; path=/; max-age=604800; SameSite=Lax`;
  }, [cart, isLoaded]);

  /**
   * Lägger till en produkt.
   * Om produkten redan finns ökas antalet med ett.
   */
  function addToCart(product: Product) {
    setCart((currentCart) => {
      const existingItem = currentCart.find((item) => item.id === product.id);

      if (existingItem) {
        return currentCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...currentCart, { ...product, quantity: 1 }];
    });
  }

  /**
   * Ökar antalet exemplar av en produkt med ett.
   */
  function increaseQuantity(productId: string) {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  }

  /**
   * Minskar antalet, men aldrig under ett.
   */
  function decreaseQuantity(productId: string) {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === productId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  }

  /**
   * Tar bort en produkt helt från varukorgen.
   */
  function removeFromCart(productId: string) {
    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== productId)
    );
  }

  /**
   * Tömmer varukorgen.
   */
  function clearCart() {
    setCart([]);
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        isLoaded,
        loadError,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

/**
 * Hook för att komma åt varukorgen från andra komponenter.
 *
 * @throws Error om CartProvider saknas.
 */
export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart måste användas inom CartProvider");
  }

  return context;
}
