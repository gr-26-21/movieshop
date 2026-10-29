"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "./ui/toast";

export function SignOutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleClick() {
    setIsLoading(true);
    await authClient.signOut();

    toast.add({
      description: "Successfully signed out",
      type: "success",
    });

    setIsLoading(false);

    router.push("/");
    router.refresh();
  }

  return (
    <>
      <Button onClick={handleClick}>
        Sign out
        {isLoading && <Spinner />}
      </Button>
    </>
  );
}
