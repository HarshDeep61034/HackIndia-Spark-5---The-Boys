import { PrismaClient } from "@prisma/client";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest, NextResponse } from "next/server";
const prisma = new PrismaClient();

export async function POST(req: NextRequest, res: NextResponse) {

    const {id, firstName, lastName, userHandle} = await req.json();

    try {

        let res = await prisma.user.update(
            {
                where: {
                    kindeId: id
                },
                data: {
                    firstName,
                    lastName,
                    ytHandle: userHandle
                }
            }
        );

    }
    catch(e){
        throw new Error("Error While Updating Profile" + res);
    }
    
    return NextResponse.json({ msg: "Profile Successfully Updated", success: true });
}
