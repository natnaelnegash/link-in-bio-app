import { PrismaClient } from "@/generated/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import {  NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient()

export async function GET() {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        return NextResponse.json({error: 'Unauthorized'}, {status: 401})
    }

    const links = await prisma.link.findMany({
        where: {ownerId: session?.user?.id},
        orderBy: {order: 'asc'}
    })

    return NextResponse.json(links)
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions)
    

    if (!session?.user?.id) {
        return NextResponse.json({error: 'Unauthorized'}, {status: 401})
    }

    const {title, url} = await request.json()
    

    if (!title || !url) {
        return NextResponse.json({error: 'Both title and url are required'}, {status: 400})
    }

    const linkCount = await prisma.link.count({
        where: {ownerId: session?.user?.id}
    })

    const newLink = await prisma.link.create({
        data: {
            title,url,
            order: linkCount,
            ownerId: session?.user?.id
        }
    })

    revalidatePath(`/${session?.user?.username}`)
    return  NextResponse.json(newLink, {status: 201})
}

export async function DELETE(request: Request) {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        return NextResponse.json({error: 'Unauthorized'}, {status: 401})
    }

    const {searchParams} = new URL(request.url)
    const linkId = searchParams.get('id')

    if (!linkId) {
        return NextResponse.json({error: 'No link Id provided'}, {status: 400})
    }

    try {
        await prisma.link.deleteMany({
            where: {
                id: linkId,
                ownerId: session.user.id
            }
        })
        revalidatePath(`/${session?.user?.username}`)
        return NextResponse.json({message: 'Link deleted successfully'}, {status: 200})
    } catch (error) {
        return NextResponse.json({error: 'Failed to delete link'}, {status: 500})
    }
}

export async function PUT(request: Request) {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        return NextResponse.json({error: 'Unauthorized'}, {status: 401})
    }

    const {id, title, url} = await request.json()

    if (!id || !title || !url) {
        return NextResponse.json({error: 'LinkId, title, and URL are required'}, {status: 400})
    }

    try {
        const updatedLink = await prisma.link.updateMany({
            where: {
                id: id,
                ownerId: session?.user?.id
            },
            data: {
                title: title,
                url: url
            }
        })
        if (updatedLink.count === 0) {
            return NextResponse.json({error: 'Link not found or User not authorized'}, {status: 404})
        }
        revalidatePath(`/${session?.user?.username}`)
        return NextResponse.json({ message: 'Link updated successfully' }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update link' }, { status: 500 })
    }
}