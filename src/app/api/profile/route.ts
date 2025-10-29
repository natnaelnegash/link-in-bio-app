import {put} from '@vercel/blob'
import { PrismaClient } from "@/generated/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

const prisma  = new PrismaClient()

export async function PATCH( request: Request ) {
    const session = await getServerSession(authOptions)

    if (!session) {
        return NextResponse.json({error: "Unauthorized" }, {status: 401})
    }

    const formdata = await request.formData()
    const displayName = formdata.get('displayName') as string
    const bio = formdata.get('bio') as string | null
    const avatarFile = formdata.get('avatarUrl') as File

    let avatarUrl: string | undefined = undefined

    if (avatarFile && avatarFile.size > 0) {
        const blob = await put(avatarFile.name, avatarFile, {
            access: 'public'
        })
        avatarUrl = blob.url
    }
}