import { PrismaClient } from "@prisma/client";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest, NextResponse } from "next/server";
const prisma = new PrismaClient();

export async function POST(req: NextRequest, res: NextResponse) {

    const { getUser } = getKindeServerSession();
    const user = await getUser();
    const url = new URL(req.url);
    const walletAddress = url.pathname.split('/').pop(); 

    if (!user || user == null || !user.id) {
        throw new Error("something went wrong with authentication" + user);
    }

    try {

        let res = await prisma.user.update(
            {
                where: {
                    kindeId: user?.id
                },
                data: {
                    walletAddress,
                }
            }
        );

    }
    catch(e){
        console.log(e);
        throw new Error("Error While Updating Wallet Address" + res);
    }
    
    return NextResponse.json({ msg: "Wallet Successfully Updated", success: true });
}
