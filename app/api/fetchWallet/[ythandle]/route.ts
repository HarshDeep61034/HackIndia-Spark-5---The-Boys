import { PrismaClient } from "@prisma/client";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest, NextResponse } from "next/server";
const prisma = new PrismaClient();

export async function GET(req: NextRequest, res: NextResponse) {

    const url = new URL(req.url);
    const ytHandle = "@"+url.pathname.split('/').pop(); 
    let response;
    try {

        response = await prisma.user.findUnique(
            {
                where: {
                    ytHandle: ytHandle
                },
            }
        );

    }
    catch(e){
        console.log(e);
        throw new Error("Error While Fetching Wallet Address" + res);
    }
    
    return NextResponse.json({ response, success: true });
}
