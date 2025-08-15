import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { verifyToken } from "@/lib/auth";

export async function GET(request, props) {
  const params = await props.params;
  const authHeader = request.headers.get("authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Token requerido" }, { status: 401 });
  }

  const token = authHeader.replace("Bearer ", "");
  const { valid, error } = verifyToken(token);

  if (!valid) {
    return NextResponse.json({ error }, { status: 403 });
  }

  const user = await prisma.users.findUnique({
    where: { id: parseInt(params.id) },
    select: {
      id: true,
      fullname: true,
      email: true,
    },
  });

  if (!user) {
    return NextResponse.json(
      { error: "Usuario no encontrado" },
      { status: 404 }
    );
  }

  return NextResponse.json(user);
}

export async function PUT(request, props) {
  const params = await props.params;
  const authHeader = request.headers.get("authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Token requerido" }, { status: 401 });
  }

  const token = authHeader.replace("Bearer ", "");
  const { valid, error } = verifyToken(token);

  if (!valid) {
    return NextResponse.json({ error }, { status: 403 });
  }

  const data = await request.json();

  const updatedUser = await prisma.users.update({
    where: { id: parseInt(params.id) },
    data: {
      fullname: data.fullname,
      email: data.email,
      password: await bcrypt.hash(data.password, 10),
    },
  });

  return NextResponse.json(updatedUser);
}

export async function DELETE(request, props) {
  const params = await props.params;
  const authHeader = request.headers.get("authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Token requerido" }, { status: 401 });
  }

  const token = authHeader.replace("Bearer ", "");
  const { valid, error } = verifyToken(token);

  if (!valid) {
    return NextResponse.json({ error }, { status: 403 });
  }

  await prisma.users.delete({
    where: { id: parseInt(params.id) },
  });

  return NextResponse.json({ mensaje: "Usuario eliminado correctamente" });
}
