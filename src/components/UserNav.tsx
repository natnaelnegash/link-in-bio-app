"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Session } from "next-auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { signOut } from "next-auth/react";
import { Palette, ToggleLeft } from "lucide-react";
import Link from "next/link";

type UserNavProps = {
  user: Session["user"];
};

export function UserNav({ user }: UserNavProps) {
  const fallbackLetter =
    user?.username?.charAt(0).toUpperCase() ||
    user?.email?.charAt(0).toUpperCase() ||
    "U";
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8 border-2 border-slate-500">
            <AvatarImage
              src={user?.image ?? undefined}
              alt={user?.username ?? ""}
            />
            <AvatarFallback>{fallbackLetter}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.username}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {/* Add other items here like Settings, Profile, etc. */}
          <DropdownMenuLabel className="flex">
            <div className="flex items-center gap-2">
              Appearance{" "}
              <span>
                <Palette className="h-4 w-4 self-center" />
              </span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuItem>
            <Link href="/dashboard/appearance">Customize Theme</Link>
          </DropdownMenuItem>
          <div className="flex items-center justify-between w-full ">
            <DropdownMenuLabel className="font-normal">Theme</DropdownMenuLabel>
            <ToggleLeft className="h-5 w-5" />
          </div>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/login" })}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
