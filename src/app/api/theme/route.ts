import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient()

export async function PATCH(request:Request) {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        return NextResponse.json({error: 'Unauthorized'}, {status: 400})
    }

    const {theme} = await request.json()

    try {
        await prisma.user.update({
            where: {id: session?.user?.id},
            data: {theme: theme}
        })

    revalidatePath(`/${session?.user?.username}`)
    } catch (error) {
        console.error('Failed to update theme', error);
        return NextResponse.json({error: 'Failed to update theme'}, {status: 500})
    }
}