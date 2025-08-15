import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const platform = await prisma.platforms.findMany();

  return NextResponse.json(platform);
}

export async function POST(request) {
  let json = await request.json();
  const platform = await prisma.platforms.create({
    data: {
      name: json.name,
    },
  });
return NextResponse.json({
  mensaje: "Plataforma creada correctamente",
  platform
});}