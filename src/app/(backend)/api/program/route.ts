import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {  NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

//step 3
import { emitSocketEvent } from "@/lib/emitSocketEvent";


//Get yung mga programs kahit sino sa roles makikita nitong mga programs.
// export async function GET() {
// try {
//     const session = await getServerSession(authOptions)
//     if(!session) return NextResponse.json({ programs:[] })

//     const userId = await prisma.user.findUnique({
//         where: { email: session.user.email! },
//         select: { id: true, role: true }
//     })

//     const programs = await prisma.program.findMany({
//         where: {
//             members: { some: { userId: userId?.id } }
//         },
//         include: session.user.role === "ADMIN" ? {
//             members: {
//                 select: {
//                     user: {
//                         select: { role: true }
//                     }
//                 }
//             }
//         } : undefined
//     })

//     const programsWithCounts = programs.map(program => {
//         if (session.user.role !== 'ADMIN') return program

//         let beneficiaries = 0
//         let instructors = 0

//         if('members' in program && Array.isArray(program.members)) {
//             program.members.forEach(m => {
//             if (m.user.role === 'BENEFICIARY') beneficiaries +=1
//             if (m.user.role === 'INSTRUCTOR') instructors +=1
//         })
//         }

//         const { ...rest } = program
//         return {
//             ...rest,
//             memberCounts: {
//                 beneficiaries,
//                 instructors
//             }
//         }
//     })
    

//     return NextResponse.json({ programs: programsWithCounts })
    
// } catch(error) {
//         console.error('failed to get programs', error)
//         return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
//     }
// }

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if(!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const params = Object.fromEntries(req.nextUrl.searchParams)
        const search = params.search ?? ''
        const page = Number(params.page) || 1
        const limit = Number(params.limit) || 6


        //filter condition
        const where: Prisma.ProgramWhereInput = search ? { title: { contains: search, mode: "insensitive" } } : {}

        // query
        const [programs, total] = await Promise.all([
            prisma.program.findMany({
                where,
                select: {
                    id: true,
                    title: true,
                    createdAt: true,
                    _count: {
                        select: {
                            members: true, // total members
                        },
                    },
                    members: {
                        select: {
                            user: {
                                select: { role: true }
                            }
                        }
                    }
                },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: "desc" }
            }),
            prisma.program.count({ where }),
        ])

        // compute breakdown (beneficiaries + instructors)
        const programsWithCounts = programs.map((program) => {
            let beneficiaries = 0
            let instructors = 0

            program.members.forEach((m) => {
                if(m.user.role === "BENEFICIARY") beneficiaries++
                if(m.user.role === "INSTRUCTOR") instructors++
            })

            return {
            id: program.id,
            title: program.title,
            createdAt: program.createdAt,
            totalMembers: program._count.members,
            memberCounts: {
                beneficiaries,
                instructors,
            }
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
