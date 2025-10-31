import {put} from '@vercel/blob'
import { PrismaClient } from "@/generated/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { revalidatePath } from 'next/cache';

const prisma  = new PrismaClient()

export async function PATCH( request: Request ) {
    const session = await getServerSession(authOptions)

    if (!session) {
        return NextResponse.json({error: "Unauthorized" }, {status: 401})
    }

    const formdata = await request.formData()
    const displayName = formdata.get('displayName') as string
    const bio = formdata.get('bio') as string
    const avatarFile = formdata.get('avatar') as File || null

    let avatarUrl: string | undefined = undefined

    if (avatarFile && avatarFile.size > 0) {
        const blob = await put(avatarFile.name, avatarFile, {
            access: 'public'
        })
        avatarUrl = blob.url
    }

    const updatedData : {displayName?: string, bio?: string, avatarUrl?: string } = {}
    if (displayName) updatedData.displayName = displayName
    if (bio !== null) updatedData.bio = bio
    if (avatarUrl) updatedData.avatarUrl = avatarUrl

    await prisma.user.update({
        where: {id: session.user.id},
        data: updatedData
    })

    revalidatePath(`/${session.user.username}`)

    return NextResponse.json({message: 'Updated user profile successfully'}, {status: 200})
}