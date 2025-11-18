import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Kunin lahat ng posts na may files (galing sa INSTRUCTOR)
        const instructorPosts = await prisma.post.findMany({
            where: {
                author: {
                    role: "INSTRUCTOR"
                },
                files: {
                    not: Prisma.JsonNull
                }
            },
            select: {
                files: true
            }
        });

        // Kunin lahat ng submissions na may files (galing sa BENEFICIARY)
        const beneficiarySubmissions = await prisma.submission.findMany({
            where: {
                student: {
                    role: "BENEFICIARY"
                },
                files: {
                    not: Prisma.JsonNull
                }
            },
            select: {
                files: true
            }
        });

        // Function para bilangin ang files sa JSON
        const countFilesInJson = (filesJson: any): number => {
            if (!filesJson) return 0;
            
            // Kung array ang files
            if (Array.isArray(filesJson)) {
                return filesJson.length;
            }
            
            // Kung object with array property (e.g., { files: [...] })
            if (typeof filesJson === 'object' && filesJson.files && Array.isArray(filesJson.files)) {
                return filesJson.files.length;
            }
            
            // Kung single file object lang
            if (typeof filesJson === 'object') {
                return 1;
            }
            
            return 0;
        };

        // Bilangin yung actual files per role
        let instructorFilesCount = 0;
        instructorPosts.forEach(post => {
            instructorFilesCount += countFilesInJson(post.files);
        });

        let beneficiaryFilesCount = 0;
        beneficiarySubmissions.forEach(submission => {
            beneficiaryFilesCount += countFilesInJson(submission.files);
        });

        // Total files
        const total = instructorFilesCount + beneficiaryFilesCount;

        // Kunin yung role na may pinaka maraming files
        let mostFilesRole = "";
        if (instructorFilesCount > beneficiaryFilesCount) {
            mostFilesRole = "INSTRUCTOR";
        } else if (beneficiaryFilesCount > instructorFilesCount) {
            mostFilesRole = "BENEFICIARY";
        } else {
            mostFilesRole = "TIE";
        }

        return NextResponse.json({
            instructorFiles: instructorFilesCount,
            beneficiaryFiles: beneficiaryFilesCount,
            total,
            mostFilesRole
        });
    
    } catch (error) {
        console.error("Failed to get files stats", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}