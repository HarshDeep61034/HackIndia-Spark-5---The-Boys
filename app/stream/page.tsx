"use client"
import { useRecoilValue } from "recoil";
import First from "../components/superChatComponents/01"
import { charWalletState } from '@/app/store/state';
import SolanaSuperchat from "@/app/components/SolanaSuperchat"
export default function (){
    const walletAddr = localStorage.getItem("lastSentAddress");

    console.log(walletAddr);
    return(
        <div>
      <SolanaSuperchat />
        </div>
    )
}