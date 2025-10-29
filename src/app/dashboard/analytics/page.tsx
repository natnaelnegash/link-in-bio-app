import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { AnalyticsChart } from "@/components/AnalyticsChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PrismaClient } from "@/generated/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

async function getAnalyticsData(userId: string) {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const pageViews = await prisma.analyticsEvent.count({
    where: { ownerId: userId, eventType: "PAGE_VIEW" },
  });

  const linkClicks = await prisma.analyticsEvent.count({
    where: { ownerId: userId, eventType: "LINK_CLICK" },
  });

  const clicksByLink = await prisma.analyticsEvent.groupBy({
    by: ["linkId"],
    _count: { linkId: true },
    where: { ownerId: userId, eventType: "LINK_CLICK", linkId: { not: null } },
    orderBy: { _count: { linkId: "desc" } },
  });

  const events = await prisma.analyticsEvent.findMany({
    where: { ownerId: userId },
    select: { eventType: true, linkId: true },
  });

  const topLinks = await prisma.link.findMany({
    where: { id: { in: clicksByLink.map((l) => l.linkId!) } },
    select: { id: true, title: true },
  });

  const topLinksData = clicksByLink.map((stat) => {
    const linkDetails = topLinks.find((l) => l.id === stat.linkId);
    return {
      name: linkDetails?.title || "Unknown Link",
      clicks: stat._count.linkId,
    };
  });

  return {
    pageViews,
    linkClicks,
    topLinksData,
    topLinks,
    clicksByLink,
    events,
  };
}

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    redirect("/login");
  }

  const {
    pageViews,
    linkClicks,
    topLinksData,
    topLinks,
    clicksByLink,
    events,
  } = await getAnalyticsData(session.user.id);

  return (
    <div className="container mx-auto py-8 max-w-md">
      <h1 className="text-3xl font-bold mb-6">Analytics</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Page Views</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{pageViews}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Link Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{linkClicks}</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Links</CardTitle>
        </CardHeader>
        <CardContent>
          <AnalyticsChart data={topLinksData} />
        </CardContent>
      </Card>
    </div>
  );
}
