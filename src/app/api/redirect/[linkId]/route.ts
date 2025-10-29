import { PrismaClient } from "@/generated/prisma"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

type RouteParams = {
    params: {
        linkId: string
    }
}

export async function GET(request: Request, {params}: RouteParams) {
    const {linkId} = params
    
    try {
        const link = await prisma.link.findUnique({
            where: {
                id: linkId
            }
        })
        if (!link) {
            return NextResponse.json({error: 'Link not found'}, {status: 404})
        }

            prisma.analyticsEvent.create({
                data: {
                    eventType: 'LINK_CLICK',
                linkId: linkId,
                ownerId: link.ownerId
                }
            }).catch(console.error)

        return NextResponse.redirect(link.url)
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'An error occurred' }, { status: 500 })
    }
}