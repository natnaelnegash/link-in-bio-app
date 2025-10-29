import { PrismaClient } from "@/generated/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

const prisma  = new PrismaClient()

export async function PATCH(request: Request) {
    const session = await getServerSession(authOptions)

    if(!session?.user?.id) {
        return NextResponse.json({error: 'Unauthorized'}, {status: 401})
    }

    const {links} = await request.json()

    if(!Array.isArray(links)) {
        return NextResponse.json({error: 'Invalid request body'}, {status: 400})
    }

    try {
        const updatePromises = links.map((link: {id: string, order: number}) => 
            prisma.link.updateMany({
                where: {id: link.id, ownerId: session?.user!.id},
                data: {
                    order: link.order,
                }
            })
        )
        await prisma.$transaction(updatePromises)

        revalidatePath(`/${session?.user?.username}`)
        return NextResponse.json({message: 'Link order updated successfully'}, {status: 200})
    } catch (error) {
        console.error('Failed to reorder links: ',error)
        return NextResponse.json({error: 'Could not reorder links'}, {status: 500})
    }
}