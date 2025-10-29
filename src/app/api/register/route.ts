import { NextResponse } from "next/server";
import { PrismaClient } from "../../../generated/prisma";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient()

export async function POST(request :Request) {
    try {
        const {email, username, password} = await request.json()

        const existingUserByEmail = await prisma.user.findUnique({
            where: {email}
        })
        if (existingUserByEmail) {
            return NextResponse.json({error: "Email already exists"},{status: 400})
        }
        const existingUserByUsername = await prisma.user.findUnique({
            where: {username}
        })
        if (existingUserByEmail) {
            return NextResponse.json({error: "Username already exists"},{status: 400})
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await prisma.user.create({
            data: {
                email,
                username,
                password:hashedPassword
            }
        })
        const {password: _, ...userWithoutPassword} = newUser
        return NextResponse.json(userWithoutPassword, {status: 201})
    } catch (error) {
        console.error(error)
        return NextResponse.json({error: 'An error occurred during registration'},{status: 500})
    }
}