import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { amount, name, message, ythandle } = await req.json();
  console.log(amount);
  const ytHandle = "@"+ythandle;
  try {
    if (!ytHandle) {
      return NextResponse.json({ error: "ytHandle is required", success: false }, { status: 400 });
    }

    // First, find the user with the given ytHandle
    const user = await prisma.user.findUnique({
      where: { ytHandle: ytHandle }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found", success: false }, { status: 404 });
    }

    // Create the chat with the found user
    const result = await prisma.chat.create({
      data: {
        amount,
        message,
        name,
        author: {
          connect: { id: user.id }
        }
      },
    });

    return NextResponse.json({ msg: "Chat Successfully Created", success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Error While creating Chat", success: false }, { status: 500 });
  }
}