import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request, props) {
  const params = await props.params;
  const platform = await prisma.platforms.findUnique({where: { id: parseInt(params.id) }});

  return NextResponse.json(platform);
}

export async function DELETE(request, props) {
  const params = await props.params;
  const id = parseInt(params.id);
  const platform = await prisma.platforms.delete({
    where: { id: id },
  });

return NextResponse.json({
  mensaje: "Plataforma eliminada correctamente",
  platform
});}

export async function PUT(request, props) {
  const params = await props.params;
  const id = parseInt(params.id);
  const body = await request.json();

  const platform = await prisma.platforms.update({
    where: { id: id },
    data: body, 
  });

return NextResponse.json({
  mensaje: "Plataforma actualizada correctamente",
  platform
});}