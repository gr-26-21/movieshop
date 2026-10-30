"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

export default function RestoreUserButton({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRestore = async () => {
    setLoading(true);
    try {
      const { error } = await authClient.admin.unbanUser({
        userId: userId,
      });

      if (error) {
        toast.add({
          type: "error",
          description: "user can not be restored",
          priority: "high",
          positionerProps: {
            side: "bottom",
          },
        });
        setLoading(false);
        return;
      }

      toast.add({
        type: "success",
        description: "Account restored successfully",
      });

      router.refresh();
      router.push("/admin/users");
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleRestore}
      disabled={loading}
      className={buttonVariants({
        variant: "secondary",
        size: "lg",
      })}
    >
      {loading ? "Restoring..." : "Restore Account"}
    </Button>
  );
}
