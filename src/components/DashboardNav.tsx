"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { buttonVariants } from "./ui/button";

const navItems = [
  { href: "/dashboard", lable: "Links" },
  { href: "/dashboard/appearance", lable: "Apearance" },
  { href: "/dashboard/profile", lable: "Profile" },
  { href: "/dashboard/analytics", lable: "Analytics" },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            pathname === item.href
              ? "bg-muted hover:bg-muted"
              : "hover:bg-transparent hover:underline",
            "justify-start"
          )}
        >
          {item.lable}
        </Link>
      ))}
    </nav>
  );
}
