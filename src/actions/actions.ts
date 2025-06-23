"use server"
import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function addTask(FormData: FormData) {
    await prisma.task.create({
        data: {
            title: FormData.get("title") as string
        }
    })
    revalidatePath("/")
}