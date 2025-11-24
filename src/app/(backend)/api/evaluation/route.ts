import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { sendEval } from "@/lib/email/sendEval"

type EvaluationPayload = {
    programId: string;
    titleOfSeminar: string;
    date: string;
    venue: string;
    suggestions?: string;
    name: string;
    ratings: {
        content: number[];
        materials: number[];
        resourcePerson: number[];
        overall: number[];
    };
};

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }


        const body = (await req.json()) as EvaluationPayload

        const newEvaluation = await prisma.evaluation.create({
            data: {
                programId: body.programId,
                userId: session.user.id,
                titleOfSeminar: body.titleOfSeminar,
                date: body.date,
                venue: body.venue,
                suggestions: body.suggestions,
                name: body.name,
                ratings: body.ratings,
            }
        })

        if (newEvaluation) {
            // get all instructors assigned to the program
            const instructors = await prisma.programMember.findMany({
                where: {
                    programId: body.programId,
                    user: { role: "INSTRUCTOR" }
                },
                select: {
                    user: { select: { email: true } }
                }
            });

            const program = await prisma.program.findUnique({
                where: { id: body.programId },
                select: { title: true }
            });

            for (const inst of instructors) {
                if (inst.user.email) {
                    await sendEval({
                        email: inst.user.email,
                        programName: program?.title ?? ""
                    });
                }
            }
        }


        return NextResponse.json(newEvaluation, { status: 201 });
    } catch (error) {
        console.log('', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}