import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Check } from "lucide-react";
import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <Card className="max-w-[400px] w-full mx-auto">
        <CardContent className="p-6 flex flex-col w-full items-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <Check className="w-8 h-8 text-green-500" />
          </div>
          <h1 className="text-2xl font-semibold mt-4 text-center">
            ¡Esta reunion ha sido reservada exitosamente!
          </h1>
          <p className="text-sm text-muted-foreground text-center mt-2">
            Gracias por reservar tu reunion con nosotros, los detalles han sido
            enviados a tu correo y esperamos que disfrutes de tu reunión.
          </p>
        </CardContent>
        <CardFooter>
          <Button className="w-full" asChild>
            <Link href="/">Volver a Inicio</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
