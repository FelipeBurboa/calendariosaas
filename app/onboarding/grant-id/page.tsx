import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Work from "@/public/work.png";
import { CalendarCheck2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function OnboardingRouteTwo() {
  return (
    <div className="min-h-screen w-screen flex items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle>¡Estas casi listo!</CardTitle>
          <CardDescription>
            Ahora necesitamos conectar tu calendario a tu cuenta
          </CardDescription>
          <Image
            src={Work}
            alt="work"
            className="w-[330px] mx-auto rounded-lg"
          />
        </CardHeader>
        <CardContent>
          <Button className="w-full" asChild>
            <Link href="/api/auth">
              <CalendarCheck2 className="mr-2" />
              Conectar{" "}
              <span className="font-bold underline underline-offset-2">
                calendario
              </span>{" "}
              a tu cuenta
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
