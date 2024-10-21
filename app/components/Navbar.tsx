import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/logo.png";
import { AuthModal } from "./AuthModal";

export function Navbar() {
  return (
    <div className="flex py-5 items-center justify-between">
      <div className="flex items-center gap-2">
        <Link href="/">
          <Image src={Logo} alt="logo" className="size-10" />
        </Link>
        <h4 className="text-3xl font-bold">
          <span className="bg-gradient-to-r from-red-500 via-orange-300 to-green-400 bg-[length:90%_4px] bg-no-repeat bg-bottom">
            Calendario
          </span>
          <span className="bg-gradient-to-r from-red-500 via-orange-300 to-green-400 inline-block text-transparent bg-clip-text ml-2">
            SaaS
          </span>
        </h4>
      </div>
      <div>
        <AuthModal />
      </div>
    </div>
  );
}
