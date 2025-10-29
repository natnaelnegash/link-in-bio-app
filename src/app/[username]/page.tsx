/* eslint-disable @typescript-eslint/no-explicit-any */
import { TrackPageView } from "@/components/TrackPageViews";
import { Button } from "@/components/ui/button";
import { PrismaClient } from "@/generated/prisma";
import Image from "next/image";
import { notFound } from "next/navigation";

const prisma = new PrismaClient();

async function getUserProfile(username: string) {
  const user = await prisma.user.findUnique({
    where: { username: username },
    select: {
      id: true,
      displayName: true,
      avatarUrl: true,
      theme: true,
      links: {
        orderBy: { order: "asc" },
        select: {
          id: true,
          title: true,
          url: true,
        },
      },
    },
  });
  return user;
}

type UserProfilePageProps = {
  params: {
    username: string;
  };
};

export default async function UserProfilePage({
  params,
}: UserProfilePageProps) {
  const userProfile = await getUserProfile(params.username);

  if (!userProfile) {
    notFound();
  }

  type Theme = {
    backgroundColor: string;
  };

  const theme: Theme = (userProfile.theme as any) || {
    backgroundColor: "#ffffff",
  };

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      <TrackPageView userId={userProfile.id} />
      <main className="container mx-auto max-w-md px-4 py-8 md:py-16">
        <div className="flex flex-col items-center text-center">
          <Image
            src={userProfile.avatarUrl || "/default-avatar.png"}
            alt={userProfile.displayName || params.username}
            width={96}
            height={96}
            className="h-24 w-24 rounded-full"
            priority
          />
          <h1 className="mt-4 text-2xl font-bold">
            {userProfile.displayName || `@${params.username}`}
          </h1>
        </div>

        <div className="mt-8 w-full space-y-4">
          {userProfile.links.map((link, index) => {
            if (link.url === "#heading") {
              return (
                <h2
                  key={link.id}
                  className="pt-4 text-xl font-bold text-center"
                >
                  {link.title}
                </h2>
              );
            }
            return (
              <a
                key={index}
                href={`/api/redirect/${link.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button size="icon" className="w-full">
                  {link.title}
                </Button>
              </a>
            );
          })}
        </div>
      </main>
    </div>
  );
}
