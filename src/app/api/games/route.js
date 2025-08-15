import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import path from "path";
import fs from "fs";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const games = await prisma.games.findMany({
      include: {
        platform: true,
        category: true,
      },
    });
    return NextResponse.json(games);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    const title = formData.get("title");
    const platform_id = parseInt(formData.get("platform_id"));
    const category_id = parseInt(formData.get("category_id"));
    const year = parseInt(formData.get("year"));
    const version = formData.get("version") || null;
    const file = formData.get("cover");

    let coverFilename = null;

    if (file && file.name) {
      const uploadDir = path.join(process.cwd(), "public", "uploads");

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      coverFilename = `${Date.now()}-${file.name}`;
      const filePath = path.join(uploadDir, coverFilename);
      fs.writeFileSync(filePath, buffer);
    }

    const newGame = await prisma.games.create({
      data: {
        title,
        platform_id,
        category_id,
        year,
        version,
        cover: coverFilename,
      },
    });

    return NextResponse.json(newGame, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
