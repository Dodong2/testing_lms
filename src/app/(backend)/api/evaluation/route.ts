import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

type EvaluationPayload = {
    programId: string;
    titleOfSeminar: string;
    date: string;
    venue: string;
    suggestions?: string;
    name?: string;
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
                name: body.name ?? session.user.name,
                ratings: body.ratings,
            }
        })

        return NextResponse.json(newEvaluation, { status: 201 });
    } catch (error) {
        console.log('', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}