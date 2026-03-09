import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from "fs/promises"
import path from "path"
import { db } from "../../../db";
import { documentsTable } from '../../../db/schema';
import { eq } from "drizzle-orm";


export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "http://localhost:3000",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Credentials": "true",
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const uploadDir = path.join(process.cwd(), "public/documents")
    const filePath = path.join(uploadDir, file.name)

    await writeFile(filePath, buffer)

    const mimeToEnum = {
      "application/pdf": "pdf",
      "image/png": "png",
      "image/jpeg": "jpeg"
    } as const

    const fileType = mimeToEnum[file.type as keyof typeof mimeToEnum]

    if (!fileType) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 })
    }

    await db.insert(documentsTable).values({
      name: file.name,
      type: fileType,
      filepath: filePath
    })

    return NextResponse.json(
      { message: "File uploaded successfully" },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id")?.trim();
  if (!id) {
    return NextResponse.json({ error: "No document ID found" }, { status: 400 });
  }
    try {
      const document = await db.select().from(documentsTable).where(eq(documentsTable.id, id));
      const result: any = document.map(row => {
        return {
          id: row.id,
          name: row.name,
          type: row.type,
          filepath: row.filepath
        }
      });
      return NextResponse.json(result);

    } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch document" },
      { status: 500 }
    )
  }
}