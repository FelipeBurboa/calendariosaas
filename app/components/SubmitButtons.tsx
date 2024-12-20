"use client";

import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";
import GoogleLogo from "@/public/google.svg";
import GithubLogo from "@/public/github.svg";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SubmitButtonProps {
  text: string;
  loaderText: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | null
    | undefined;
  className?: string;
}

export function GoogleAuthButton() {
  const { pending } = useFormStatus();
  return (
    <>
      {pending ? (
        <Button disabled variant="outline" className="w-full">
          <Loader2 className="size-4 mr-2 animate-spin" />
          Cargando...
        </Button>
      ) : (
        <Button variant="outline" className="w-full">
          <Image src={GoogleLogo} alt="Google Logo" className="size-4 mr-2" />
          Crear cuenta con Google
        </Button>
      )}
    </>
  );
}

export function GighubAuthButton() {
  const { pending } = useFormStatus();
  return (
    <>
      {pending ? (
        <Button disabled variant="outline" className="w-full">
          <Loader2 className="size-4 mr-2 animate-spin" />
          Cargando...
        </Button>
      ) : (
        <Button variant="outline" className="w-full">
          <Image src={GithubLogo} alt="Github Logo" className="size-4 mr-2" />
          Crear cuenta con Github
        </Button>
      )}
    </>
  );
}

export function SubmitButton({
  text,
  loaderText,
  variant,
  className,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();
  return (
    <>
      {pending ? (
        <Button disabled variant="outline" className={cn("w-fit", className)}>
          <Loader2 className="size-4 mr-2 animate-spin" />
          {loaderText}
        </Button>
      ) : (
        <Button
          variant={variant}
          className={cn("w-fit", className)}
          type="submit"
        >
          {text}
        </Button>
      )}
    </>
  );
}
