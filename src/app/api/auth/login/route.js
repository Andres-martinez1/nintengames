import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "mysecretkey";

export async function POST(request) {
  const { email, password } = await request.json();

  const user = await prisma.users.findUnique({
    where: { email },
  });

  if (!user) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 });
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      fullname: user.fullname,
    },
    SECRET_KEY,
    { expiresIn: "1d" }
  );

  return NextResponse.json({ token });
}
