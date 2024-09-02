import { PrismaClient } from "@prisma/client";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
 
    const url = new URL(req.url);
    const walletAddress = url.pathname.split('/').pop(); 
    
    
    let response;
    try {
        const userInDb = await prisma.user.findUnique({
            where: {
                walletAddress: walletAddress
            }
        });
        
    if (!userInDb?.ytHandle) {
        return NextResponse.json({ success: false, message: "User ytHandle is not available" }, { status: 400 });
    }
    
    response = await prisma.chat.findMany({
      where: {
        ytHandle: userInDb.ytHandle
      }
    });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ success: false, message: "Error While Fetching Super Chats" }, { status: 500 });
  }

  return NextResponse.json({ response, success: true });
}
