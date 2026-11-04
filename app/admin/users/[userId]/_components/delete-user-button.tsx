"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

export default function SoftDeleteUserButton({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSoftDelete = async () => {
    setLoading(true);
    try {
      const { error } = await authClient.admin.banUser({
        userId: userId,
        banReason: "Account deactivated by admin",
      });

      if (error) {
        toast.add({
          type: "error",
          description: "user can not be deactivated",
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
        description: "Account deactivated (soft delete) successfully",
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
      onClick={handleSoftDelete}
      disabled={loading}
      className={buttonVariants({
        variant: "default",
        size: "lg",
      })}
    >
      {loading ? "Deactivating..." : "Deactivate Account"}
    </Button>
  );
}
