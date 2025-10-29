import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient()

export async function POST(request: Request) {
    const {userId} = await request.json()

    if(!userId) {
        return NextResponse.json({error: 'User Id is required'}, {status: 400})
    }

    try {
        await prisma.analyticsEvent.create({
            data: {
                eventType: 'PAGE_VIEW',
                ownerId: userId
            }
        })

        return NextResponse.json({success: true}, { })
    } catch (error) {
        console.error(error)
        return NextResponse.json({error: 'Failed to track view'}, {status: 500})
    }
}