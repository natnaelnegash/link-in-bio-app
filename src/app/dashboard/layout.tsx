import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { UserNav } from "@/components/UserNav";
import { DashboardNav } from "@/components/DashboardNav";
import { LivePreview } from "@/components/LivePreview";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between">
          <DashboardNav /> 
          <UserNav user={session.user} />
        </div>
      </header> */}
      <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr_300px]">
        <aside className="hidden w-[200px] flex-col md:flex">
          <DashboardNav />
        </aside>
        <main className="flex w-full flex-1 flex-col overflow-hidden py-6">
          {children}
        </main>
        <aside className="hidden flex-col md:flex">
          <LivePreview username={session.user.username} />
        </aside>
      </div>
    </div>
  );
}
