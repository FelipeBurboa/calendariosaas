"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Link2 } from "lucide-react";
import { toast } from "sonner";

export function CopyLinkMenu({
  meetingUrl,
  disabled,
}: {
  meetingUrl: string;
  disabled: boolean;
}) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(meetingUrl);
      toast.success("URL copiada exitosamente");
    } catch (error) {
      console.error("Error al copiar el link:", error);
      toast.error("Error al copiar el link");
    }
  };
  return (
    <DropdownMenuItem onSelect={handleCopy} disabled={disabled}>
      <Link2 className="size-4 mr-2" />
      Copiar
    </DropdownMenuItem>
  );
}
