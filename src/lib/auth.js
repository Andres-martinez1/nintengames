import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { verifyToken } from "@/lib/auth";


export async function GET(request) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Token requerido" }, { status: 401 });
  }

  const token = authHeader.replace("Bearer ", "");
  const { valid, error } = verifyToken(token);

  if (!valid) {
    return NextResponse.json({ error }, { status: 403 });
  }

  const users = await prisma.users.findMany({
    select: {
      id: true,
      fullname: true,
      email: true,
    },
  });

  return NextResponse.json(users);
}


export async function POST(request) {
  const data = await request.json();

  if (!data.fullname || !data.email || !data.password) {
    return NextResponse.json(
      { error: "Todos los campos son obligatorios" },
      { status: 400 }
    );
  }

  const existingUser = await prisma.users.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    return NextResponse.json(
      { error: "El correo ya está registrado" },
      { status: 409 }
    );
  }

  
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const newUser = await prisma.users.create({
    data: {
      fullname: data.fullname,
      email: data.email,
      password: hashedPassword,
    },
  });

  return NextResponse.json({
    id: newUser.id,
    fullname: newUser.fullname,
    email: newUser.email,
    message: "Usuario creado exitosamente",
  });
}
