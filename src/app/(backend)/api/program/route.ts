import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {  NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

//step 3
import { emitSocketEvent } from "@/lib/emitSocketEvent";


/* 
Get yung mga programs makakakita lang ng mga program ay yung beneficiary at Admin. 
pero sa instructor makikita lang yung kanila
*/

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if(!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email! },
            select: { id: true, role: true }
        })

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        const params = Object.fromEntries(req.nextUrl.searchParams)
        const search = params.search ?? ''
        const page = Number(params.page) || 1
        const limit = Number(params.limit) || 6
        const joinedOnly = req.nextUrl.searchParams.get("joinedOnly") === "true"


        // search filter
        const searchFilter: Prisma.ProgramWhereInput = search ? { title: { contains: search, mode: "insensitive" } } : {}
        

        // role-based filter
        const roleFilter: Prisma.ProgramWhereInput = user.role === 'ADMIN' 
        ? {} // admin see all
        : user.role === 'INSTRUCTOR'
        ? { members: { some: { userId: user.id } } } // instructor only their program can see 
        : joinedOnly 
        ? { members: { some: { userId: user.id } } } // beneficiary see joined
        : {} // beneficiary all

        const where: Prisma.ProgramWhereInput = {
            AND: [searchFilter, roleFilter]
        }

        // query paginated programs + total
        const [programs, total] = await Promise.all([
            prisma.program.findMany({
                where,
                select: {
                    id: true,
                    title: true,
                    subtitle: true,
                    explanation: true,
                    createdAt: true,
                    _count: {
                        select: {
                            members: true, // total members
                        },
                    },
                    members: {
                        select: {
                            userId: true,
                            user: {
                                select: { role: true }
                            }
                        }
                    },
                    JoinRequest: {
                        where: { userId: user.id, status: "PENDING" },
                        select: { id: true }
                    }
                },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: "desc" }
            }),
            prisma.program.count({ where }),
        ])

        // compute member counts
        const programsWithCounts = programs.map((program) => {
            let beneficiaries = 0
            let instructors = 0

            program.members.forEach((m) => {
                if(m.user.role === "BENEFICIARY") beneficiaries++
                if(m.user.role === "INSTRUCTOR") instructors++
            })

            const totalMembers = program.members.filter(m => m.user.role !== "ADMIN").length

            // joined flag for beneficiary
            const joined = user.role === 'BENEFICIARY' ? program.members.some((m) => m.userId === user.id) : true
            const pending = user.role === 'BENEFICIARY' && program.JoinRequest.length > 0

            return {
            id: program.id,
            title: program.title,
            subtitle: program.subtitle,
            explanation: program.explanation,
            createdAt: program.createdAt,
            totalMembers,
            memberCounts: {
                beneficiaries,
                instructors,
            },
            joined,
            pending
        }

        })

        return NextResponse.json({
            programs: programsWithCounts,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        })
       

    } catch(error) {
        console.error("Failed to get programs", error)
        return NextResponse.json({ error: "Internal server error" },{ status: 500 })
    }
}

// gagawa ng programs admin lang ang makakagawa
export async function POST(req: Request) {
try{
    const session = await getServerSession(authOptions)
    if(!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { title, subtitle, explanation, emails } = body

    const admin = await prisma.user.findUnique({ where: { email: session.user.email! } })
    if(!admin) { return NextResponse.json({ error: 'Creator not found' }, { status: 404 }) }

        const [program, users] = await Promise.all([
            prisma.program.create({
                data: {
                    title,
                    subtitle,
                    explanation,
                    adminId: admin.id,
                },
            }),
            prisma.user.findMany({
                where: { email: { in: emails } }
            }),
        ])  

        await prisma.programMember.createMany({
            data: [ ...users.map((user) => ({
                programId: program.id,
                userId: user.id
            })),
            {
                programId: program.id,
                userId: admin.id
            }
        ],
            skipDuplicates: true
        });

        //Kapag tapos na gumawa ng bagong program, tatawagin ang emitSocketEvent() para sabihan ang Socket.IO server na "Uy may bagong program!"
       await emitSocketEvent('program',"program-created", program)
        
        return NextResponse.json({ success: true, program })

    } catch(error) {
        console.error('Failed to created Program', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
