import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {

    const formData = await req.formData()
    const file = formData.get("file") as File

    if(!file) return NextResponse.json({error: "No File uploaded"}, { status: 400 })
    
    const form = new FormData()
    form.append("file", file)

    // ✅ Send to OCR server
    const response = await fetch("http://localhost:4000/ocr", {
        method: "POST",
        body: form
    })

    const data = await response.json()
    return NextResponse.json(data)

    } catch (error) {
        console.error("Failed to connect ocr")
        return NextResponse.json({ error: "internal server error" }, { status: 500 })
    }
}