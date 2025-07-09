import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

type Context = {
  params: {
    id: string;
  };
};

// pang add ng members sa existing program for admin only
export async function POST(req: NextRequest, context: Context) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { emails } = body;
  const programId = context.params.id;

  const users = await prisma.user.findMany({
    where: { email: { in: emails } },
  });

  await prisma.programMember.createMany({
    data: users.map((user) => ({
      programId,
      userId: user.id,
    })),
    skipDuplicates: true,
  });

  return NextResponse.json({ success: true });
}

// delete ang programs admin lang ang makaka-delete
export async function DELETE(req: NextRequest, context: Context) {
try {
    const session = await getServerSession(authOptions)

    // 1. Check for admin privileges
    if(!session || session.user.role !== 'ADMIN')
        return NextResponse.json({ error: 'Unauthorized' },{ status: 401 })

    // 2. Get program ID from URL
    const programId = context.params.id

    // 3. Find the program
    const programs = await prisma.program.findUnique({
        where: { id: programId }
    })

    if(!programs) {
        return NextResponse.json({ error: 'Program doesnt exist' }, { status: 404 })
    }

    // 4. Delete the program
    await prisma.program.delete({
        where: { id: programId }
    })

    // 5. Return success response
    return NextResponse.json({ success: true, message: 'Program deleted' })

} catch(error){
    console.error('Failed to delete programs', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
}

}