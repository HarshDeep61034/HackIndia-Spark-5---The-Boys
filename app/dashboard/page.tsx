"use client";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { Connection, PublicKey } from '@solana/web3.js';
import Chart from "../components/Chart";
import ThemeToggleButton from "../components/ThemeToggleButton";
import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";
import { useRouter } from "next/navigation";
import { useRecoilState } from "recoil";
import {walletState} from "@/app/store/state"

const connection = new Connection('https://api.devnet.solana.com');

export default function () {
    const { publicKey, connected } = useWallet();
    const [walletAddress, setWalletAddress] = useRecoilState(walletState);
    const [loading, setLoading] = useState(false);
    const [toastId, setToastId] = useState("");
    const [balance, setBalance] = useState<number | null>(null);
    const { user, isAuthenticated, isLoading } = useKindeAuth();
    const router = useRouter();

    // useEffect(()=>{
    //     if(!isAuthenticated && !isLoading){
    //         router.push("/auth");
    //     }
    // },[user, isLoading]);

    async function fetchBalance(address: string) {
        try {
            const publicKey = new PublicKey(address);
            const balance = await connection.getBalance(publicKey);
            return balance / 1e9; // Convert lamports to SOL
        } catch (error) {
            console.error("Error fetching balance:", error);
            return null;
        }
    }


    async function sendData(address: string) {
        const myPromise = axios.post(`/api/save-wallet-address/${address}`);

        toast.promise(myPromise, {
            loading: 'Updating Wallet Address...',
            success: 'Wallet Address Updated!!',
            error: 'Error while updating!!',
        });

        return myPromise;
    }

    useEffect(() => {
        const lastSentAddress = localStorage.getItem('lastSentAddress');

        if (connected && publicKey) {
            const newWalletAddress = publicKey.toString();
            setWalletAddress(newWalletAddress);

            if (newWalletAddress !== lastSentAddress) {
                console.log("Calling sendData");
                sendData(newWalletAddress);
                localStorage.setItem('lastSentAddress', newWalletAddress);  // Update the stored address
            }

            fetchBalance(newWalletAddress).then(fetchedBalance => {
                setBalance(fetchedBalance);
            });

        }


    }, [connected, publicKey]);

    return (
        <main>
            <Toaster />
            <div className="h-10 p-4 w-100% flex justify-end"><ThemeToggleButton /> <WalletMultiButton style={{}} /></div>
            {loading ? "Updating Wallet Address..." : ""}

            <h1 className="text-3xl font-semibold">Hi there, {user?.given_name}</h1>         {walletAddress && <div> <h2 className="text-2xl font-medium">Your Current Balance: {balance !== null ? balance.toFixed(2) + " SOL" : "Loading..."}</h2>        </div>}

            <Chart walletAddress={walletAddress} />
        </main>
    )
}
