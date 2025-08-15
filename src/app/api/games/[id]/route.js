import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import path from "path";
import { writeFile } from "fs/promises";

const prisma = new PrismaClient();

export async function GET(req, props) {
  const params = await props.params;
  try {
    const { id } = params;
    console.log("ID recibido:", id, "Tipo:", typeof id);

    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { error: "ID inválido o no proporcionado" },
        { status: 400 }
      );
    }

    const juego = await prisma.games.findUnique({
      where: { id: Number(id) },
    });

    if (!juego) {
      return NextResponse.json({ error: "No encontrado" }, { status: 404 });
    }

    return NextResponse.json(juego);
  } catch (error) {
    console.error("Error en GET /api/games/[id]:", error);
    return NextResponse.json(
      { error: error.message || "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, props) {
  const params = await props.params;
  try {
    const { id } = params;

    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { error: "ID inválido o no proporcionado" },
        { status: 400 }
      );
    }

    const game = await prisma.games.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({
      mensaje: "Juego eliminado correctamente",
      game,
    });
  } catch (error) {
    console.error("Error en DELETE /api/games/[id]:", error);
    return NextResponse.json(
      { error: error.message || "Error interno" },
      { status: 500 }
    );
  }
}

export async function PUT(req, props) {
  const params = await props.params;
  try {
    const { id } = params;

    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { error: "ID inválido o no proporcionado" },
        { status: 400 }
      );
    }

    const formData = await req.formData();
    const data = {};

    if (formData.has("title")) {
      data.title = formData.get("title");
    }
    if (formData.has("platform_id")) {
      data.platform_id = parseInt(formData.get("platform_id"));
    }
    if (formData.has("category_id")) {
      data.category_id = parseInt(formData.get("category_id"));
    }
    if (formData.has("year")) {
      data.year = parseInt(formData.get("year"));
    }
    if (formData.has("version")) {
      data.year = parseInt(formData.get("version"));
    }
    if (formData.has("cover")) {
      const coverFile = formData.get("cover");
      if (coverFile && coverFile.name) {
        const fileName = Date.now() + "_" + coverFile.name;
        const filePath = path.join(
          process.cwd(),
          "public",
          "uploads",
          fileName
        );
        const bytes = await coverFile.arrayBuffer();
        await writeFile(filePath, Buffer.from(bytes));
        data.cover = `/uploads/${fileName}`;
      }
    }

    const updatedGame = await prisma.games.update({
      where: { id: Number(id) },
      data,
    });

    return NextResponse.json(updatedGame);
  } catch (error) {
    console.error("Error en PUT /api/games/[id]:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
