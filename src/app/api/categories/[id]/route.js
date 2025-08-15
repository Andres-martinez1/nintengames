import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request, props) {
  const params = await props.params;
  const id = parseInt(params.id);
  const categori = await prisma.categories.findUnique({
    where: { id },
  });

  return NextResponse.json(categori);
}

export async function DELETE(request, props) {
  const params = await props.params;
  const id = parseInt(params.id);

  const categori = await prisma.categories.delete({
    where: { id },
  });

  return NextResponse.json({
    mensaje: "Categoria eliminada correctamente",
    categori});
}

export async function PUT(request, props) {
  const params = await props.params;
  const id = parseInt(params.id);
  const body = await request.json();

  const categori = await prisma.categories.update({
    where: { id },
    data: {
      name: body.name,
    },
  });

  return NextResponse.json({
     mensaje: "Categoria actualizada correctamente",
    categori});
}