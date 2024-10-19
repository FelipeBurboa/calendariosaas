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

export function AuthModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-center">
          Prueba Gratis
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[360px]">
        <DialogHeader className="flex flex-row items-center gap-2 justify-center">
          <Image src={Logo} alt="logo" className="size-10" />
          <h4 className="text-3xl font-bold">
            <span className="bg-gradient-to-r from-red-500 via-orange-300 to-green-400 bg-[length:90%_4px] bg-no-repeat bg-bottom">
              Mailer
            </span>
            <span className="bg-gradient-to-r from-red-500 via-orange-300 to-green-400 inline-block text-transparent bg-clip-text ml-2">
              SaaS
            </span>
          </h4>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
