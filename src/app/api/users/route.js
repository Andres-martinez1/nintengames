import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  const user = await prisma.users.findMany();
  return NextResponse.json(user);
}

export async function POST(request) {
  let json = await request.json();

  const hashedPassword = await bcrypt.hash(json.password, 10);

  const usuario = await prisma.users.create({
    data: {
      fullname: json.fullname,
      email: json.email,
      password: hashedPassword, 
    },
  });

  return NextResponse.json({
    mensaje: "Usuario creado correctamente",
    usuario,
  });
}
