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
  const { id } = await context.params
  const programId = id;

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

