import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";


const registerSchema = z.object({
    email: z.string().email(),
    name: z.string(),
    role: z.enum(["ADMIN", "INSTRUCTOR", "BENEFICIARY"])
})

export async function POST(req: Request) {
    const body = await req.json()
    const parsed = registerSchema.safeParse(body)

    if(!parsed.success) {
        return NextResponse.json({ error: "Invalid input" }, { status: 400 })
    }

    const { email, name, role } = parsed.data

    const existingUser = await prisma.user.findUnique({ where: { email } })

    if(existingUser) {
        return NextResponse.json({ error: "User already exists" }, { status: 409 })
    }

    const newUser = await prisma.user.create({
        data: { email, name, role },
    })

    return NextResponse.json({ success: true, user: newUser })
}