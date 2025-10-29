/* eslint-disable @typescript-eslint/no-explicit-any */
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { UserNav } from "@/components/UserNav";
import { PrismaClient } from "@/generated/prisma";
import LinkList from "@/components/LinkList";
import { Activity } from "lucide-react";
import Link from "next/link";
import { AddBlockMenu } from "@/components/AddBlockMenu";

const prisma = new PrismaClient();

async function getUserLinks(userId: string) {
  const links = await prisma.link.findMany({
    where: { ownerId: userId },
    orderBy: { order: "asc" },
  });

  return links;
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const links = await getUserLinks(session?.user?.id);

  return (
    <div className="flex min-h-screen items-center justify-center w-full min-w-md">
      <div className="min-h-screen bg-slate-100 px-2 rounded-2xl">
        <header className="container mx-auto flex h-16 items-center justify-between">
          <div className="font-bold flex justify-between w-full">
            <h1>Dashboard</h1>
            <UserNav user={session.user} />
          </div>
        </header>
        <h2 className="text-2xl">
          Welcome back {session.user?.username || "User"}!
        </h2>

        <main className="container mx-auto py-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl">Your Links</h2>
            <AddBlockMenu />
          </div>
          <LinkList initialLinks={links} />
          <Link href="/dashboard/analytics">
            <div className="mt-5 rounded-full w-10 h-10 bg-white border-2 border-slate-500 items-center flex justify-center">
              <Activity className="h-4 w-4" />
            </div>
          </Link>
        </main>
      </div>
    </div>
  );
}
