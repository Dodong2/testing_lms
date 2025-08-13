import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import ProgramClient from "../pages/ProgramClient";

interface Props {
    params: {
        id: string
    }
}

export default async function ProgramPage({ params }: Props) {

    const session = await getServerSession(authOptions)

    if(!session) redirect("/")

    const { id } = await params

    const program = await prisma.program.findUnique({
        where: { id },
        select: {
            id: true,
            title: true,
            subtitle: true,
            explanation: true
        }
    })

    if (!program) return <div>Program not found</div>

    return (
        <ProgramClient program={program} username={session.user.name || 'User'}/>
    )
}