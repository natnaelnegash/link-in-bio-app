/* eslint-disable @typescript-eslint/no-explicit-any */
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { AppearanceForm } from "@/components/AppearanceForm";
import { PrismaClient } from "@/generated/prisma";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

async function getUserTheme(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { theme: true },
  });

  return user?.theme;
}

export default async function AppearancePage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) redirect("/login");

  const theme = await getUserTheme(session.user.id);

  return (
    <div className="mx-auto max-w-md">
      <div className="flex  flex-col">
        <h1 className="text-3xl font-bold mb-6">Appearance</h1>
        <p className="text-muted-foreground mb-8">
          Customize the look and feel of your public page.
        </p>
        <AppearanceForm initialTheme={theme as any} />
      </div>
    </div>
  );
}
