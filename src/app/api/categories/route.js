import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const categori = await prisma.categories.findMany();

  return NextResponse.json(categori);
}

export async function POST(request) {
  let json = await request.json();
  const categori = await prisma.categories.create({
    data: {
      name: json.name,
    },
  });
  return NextResponse.json({
    mensaje: "Categoria creado correctamente",
    categori});
}