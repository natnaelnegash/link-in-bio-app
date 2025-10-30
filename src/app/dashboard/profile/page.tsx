import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { PrismaClient } from "@/generated/prisma";
import { ProfileForm } from "@/components/ProfileForm";

const prisma = new PrismaClient();
const getUserProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      displayName: true,
      bio: true,
      avatarUrl: true,
    },
  });
  return user;
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.id) redirect("/login");

  const profile = await getUserProfile(session.user.id);

  return (
    <div className="max-w-2xl container mx-auto">
      <div className="container py-8 w-lg">
        <h1 className="text-3xl font-bold mb-6">Profile Settings</h1>
        <ProfileForm initialProfile={profile} />
      </div>
    </div>
  );
}
