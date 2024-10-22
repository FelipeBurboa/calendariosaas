"use client";

import { cn } from "@/lib/utils";
import {
  CalendarCheck,
  HomeIcon,
  LucideProps,
  Settings,
  Users2,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ForwardRefExoticComponent, RefAttributes } from "react";

interface NavbarProps {
  id: number;
  name: string;
  href: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
}

export const dashboardLinks: NavbarProps[] = [
  {
    id: 0,
    name: "Inicio",
    href: "/dashboard",
    icon: HomeIcon,
  },
  {
    id: 1,
    name: "Reuniones",
    href: "/dashboard/reuniones",
    icon: Users2,
  },
  {
    id: 2,
    name: "Disponibilidad",
    href: "/dashboard/disponibilidad",
    icon: CalendarCheck,
  },
  {
    id: 3,
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export function DashboardLinks() {
  const pathname = usePathname();
  return (
    <>
      {dashboardLinks.map((link) => (
        <Link
          key={link.id}
          href={link.href}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary border-[1px] border-transparent",
            pathname === link.href
              ? "text-primary bg-primary/10 font-medium border-primary/20"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <link.icon className="size-5" />
          {link.name}
        </Link>
      ))}
    </>
  );
}
