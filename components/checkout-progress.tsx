"use client";

import Link from "next/link";
import { useCart } from "@/context/cart-context";
import { Progress } from "@/components/ui/progress";

const steps = [
  { label: "Shopping Cart", href: "/cart" },
  { label: "Checkout", href: "/checkout" },
  { label: "Order Confirmation", href: "/order_confirmation" },
];

type CheckoutProgressProps = {
  currentStep: 1 | 2 | 3;
};

export function CheckoutProgress({ currentStep }: CheckoutProgressProps) {
  const { cart } = useCart();
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="mx-auto mb-6 w-full max-w-2xl space-y-3">
      <div className="grid grid-cols-3 gap-1 text-center text-xs sm:gap-3 sm:text-sm">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const label =
            stepNumber === 1 ? `${step.label} (${cartCount})` : step.label;

          const baseClassName =
            "min-w-0 rounded px-1 break-words focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

          const statusClassName =
            stepNumber === currentStep
              ? "font-semibold text-primary dark:text-red-400"
              : stepNumber < currentStep
                ? "text-foreground"
                : "text-muted-foreground";

          const className = `${baseClassName} ${statusClassName}`;

          if (stepNumber < currentStep) {
            return (
              <Link key={step.label} href={step.href} className={className}>
                {stepNumber === 3 ? (
                  <>
                    <span className="sm:hidden">Confirmation</span>
                    <span className="hidden sm:inline">Order Confirmation</span>
                  </>
                ) : (
                  label
                )}
              </Link>
            );
          }

          return (
            <span
              key={step.label}
              className={className}
              aria-current={stepNumber === currentStep ? "step" : undefined}
            >
              {stepNumber === 3 ? (
                <>
                  <span className="sm:hidden">Confirmation</span>
                  <span className="hidden sm:inline">Order Confirmation</span>
                </>
              ) : (
                label
              )}
            </span>
          );
        })}
      </div>

      <Progress
        value={(currentStep / steps.length) * 100}
        aria-label={`Step ${currentStep} of ${steps.length}`}
      />
    </div>
  );
}
