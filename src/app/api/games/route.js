import { writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const game = await prisma.games.findMany();
  
  
  return NextResponse.json(game);
}

export const config = {
  api: {
    bodyParser: true,
  },
};

export async function POST(req) {
  const formData = await req.formData();
  const title = formData.get("title");
  const platform_id = parseInt(formData.get("platform_id"));
  const category_id = parseInt(formData.get("category_id"));
  const year = parseInt(formData.get("year"));
  const version = Number(formData.get("version"));

  const file = formData.get("cover");
  if (!file || typeof file === "string") {
    return NextResponse.json(
      { error: "No se subió imagen válida" },
      { status: 400 }
    );
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const fileName = Date.now() + "_" + file.name;
  const filePath = path.join(process.cwd(), "public", "uploads", fileName);

  await writeFile(filePath, buffer);

  const game = await prisma.games.create({
    data: {
      title,
      platform_id,
      category_id,
      year,
      version,
      cover: `/uploads/${fileName}`,
    },
  });

  return NextResponse.json({ mensaje: "Game creado correctamente", game });
}
