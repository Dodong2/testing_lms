import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

interface Props {
    params: {
        id: string
    }
}

export default async function ProgramPage({ params }: Props) {

    const session = await getServerSession(authOptions)

    if(!session) redirect("/")

    const program = await prisma.program.findUnique({
        where: { id: params.id }
    })

    if (!program) return <div>Program not found</div>

    return (
        <div>
            <h1>{program.title}</h1>
            <p>{program.subtitle}</p>
            <p>{program.explanation}</p>
            <p>Welcome, {session.user.name}!</p>
        </div>
    )
}