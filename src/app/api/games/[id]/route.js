import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import path from "path";
import fs from "fs";

const prisma = new PrismaClient();

export async function GET(_, { params }) {
  try {
    const game = await prisma.games.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        platform: true,
        category: true,
      },
    });

    if (!game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    return NextResponse.json(game);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const id = parseInt(params.id);
    const game = await prisma.games.findUnique({ where: { id } });

    if (!game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    const formData = await req.formData();
    const title = formData.get("title");
    const platform_id = parseInt(formData.get("platform_id"));
    const category_id = parseInt(formData.get("category_id"));
    const year = parseInt(formData.get("year"));
    const version = formData.get("version") || null;
    const file = formData.get("cover");

    let coverFilename = game.cover;

    if (file && file.name) {
      if (coverFilename) {
        const oldPath = path.join(process.cwd(), "public", "uploads", coverFilename);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      const uploadDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      coverFilename = `${Date.now()}-${file.name}`;
      const filePath = path.join(uploadDir, coverFilename);
      fs.writeFileSync(filePath, buffer);
    }

    const updatedGame = await prisma.games.update({
      where: { id },
      data: {
        title,
        platform_id,
        category_id,
        year,
        version,
        cover: coverFilename,
      },
    });

    return NextResponse.json(updatedGame);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(_, { params }) {
  try {
    const id = parseInt(params.id);
    const game = await prisma.games.findUnique({ where: { id } });

    if (!game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    if (game.cover) {
      const coverPath = path.join(process.cwd(), "public", "uploads", game.cover);
      if (fs.existsSync(coverPath)) {
        fs.unlinkSync(coverPath);
      }
    }

    await prisma.games.delete({ where: { id } });

    return NextResponse.json({ message: "Game deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
