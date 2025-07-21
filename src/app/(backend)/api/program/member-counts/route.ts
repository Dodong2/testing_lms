import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await prisma.programMember.findMany({
    select: {
      programId: true,
      user: {
        select: {
          role: true,
        }
      }
    }
  });

  const grouped = data.reduce<Record<string, { instructors: number, beneficiaries: number }>>((acc, item) => {
    const { programId, user } = item;

    if (!acc[programId]) {
      acc[programId] = { instructors: 0, beneficiaries: 0 };
    }

    if (user.role === 'INSTRUCTOR') {
      acc[programId].instructors += 1;
    } else if (user.role === 'BENEFICIARY') {
      acc[programId].beneficiaries += 1;
    }

    return acc;
  }, {});

  // Convert object to array format (same as before)
  const result = Object.entries(grouped).map(([programId, counts]) => ({
    programId,
    ...counts
  }));

  return NextResponse.json(result);
}
