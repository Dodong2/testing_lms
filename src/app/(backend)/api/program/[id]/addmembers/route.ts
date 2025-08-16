import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { emitSocketEvent } from "@/lib/emitSocketEvent";
import { sendProgramInviteEmail } from "@/lib/email/sendProgramInvite";

type Context = {
  params: {
    id: string;
  };
};

// pang add ng members sa existing program for admin only
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { emails } = body;
  const { id } = await params
  const programId = id;

  const users = await prisma.user.findMany({
    where: { email: { in: emails } },
  });

    const program = await prisma.program.findUnique({
    where: { id: programId },
  })

  if(!program) {
    return NextResponse.json({ error: 'Program not found' }, { status: 404 })
  }

  await prisma.programMember.createMany({
    data: users.map((user) => ({
      programId,
      userId: user.id,
    })),
    skipDuplicates: true,
  });


  
  //for real-time await for trigger member-add
  await new Promise((res) => setTimeout(res, 300))
  await emitSocketEvent('program','member-added', {
  programId,
  newMembers: users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  }))
})

  // for sending email to notif user
  await Promise.all(
    users.map((member) => 
      sendProgramInviteEmail({
        email: member.email,
        name: member.name,
        programName: program.title,
        role: member.role
      })
    )
  )

  return NextResponse.json({ success: true });
}

