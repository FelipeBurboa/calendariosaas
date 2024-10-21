import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Logo from "@/public/logo.png";
import Image from "next/image";
import { signIn } from "../lib/auth";
import { GoogleAuthButton, GighubAuthButton } from "./SubmitButtons";

export function AuthModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full justify-center">Prueba Gratis</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[360px]">
        <DialogHeader className="flex flex-row items-center gap-2 justify-center">
          <DialogTitle></DialogTitle>
          <Image src={Logo} alt="logo" className="size-10" />
          <h4 className="text-3xl font-bold">
            <span className="bg-gradient-to-r from-red-500 via-orange-300 to-green-400 bg-[length:90%_4px] bg-no-repeat bg-bottom">
              Calendario
            </span>
          </h4>
        </DialogHeader>
        <DialogDescription>
          <p className="text-center">
            <span className="font-semibold">Prueba gratis</span> para obtener
            acceso a todas las funcionalidades del sistema
          </p>
        </DialogDescription>
        <div className="flex flex-col gap-2 w-full px-7">
          <form
            action={async () => {
              "use server";
              await signIn("google");
            }}
          >
            <GoogleAuthButton />
          </form>
          <form
            action={async () => {
              "use server";
              await signIn("github");
            }}
          >
            <GighubAuthButton />
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
