"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { Transaction, SystemProgram } from "@solana/web3.js";
import { Label } from "@/app/components/ui/label";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/components/ui/button";
import toast, { Toaster } from "react-hot-toast";

export default function Page() {
  const { ythandle } = useParams();
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [walletAddr, setWalletAddr] = useState<string | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [name, setName] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  async function fetchWalletAddress() {
    try {
      const res = await axios.get(`/api/fetchWallet/${ythandle}`);
      setWalletAddr(res?.data.response.walletAddress);
    } catch (error) {
      console.error("Error fetching wallet data:", error);
      toast.error("Failed to fetch wallet data.");
    }
  }

  async function checkIfStreaming() {
    try {
      const apiKey = "AIzaSyCyiqiUsW3w5oaEJC7K6gjiJXoPoUPOKLY";
      const searchApiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${ythandle}&type=channel&key=${apiKey}`;

      const searchResponse = await axios.get(searchApiUrl);
      const searchData = searchResponse.data;

      if (searchData.items && searchData.items.length > 0) {
        const channelId = searchData.items[0].id.channelId;

        // Step 2: Check live broadcast status
        const liveApiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&eventType=live&type=video&key=${apiKey}`;
        const liveResponse = await axios.get(liveApiUrl);
        const liveData = liveResponse.data;

        if (liveData.items && liveData.items.length > 0) {
          setIsStreaming(true);
        } else {
          setIsStreaming(false);
        }
      } else {
        setIsStreaming(false);
      }
    } catch (error) {
      console.error("Error checking live status:", error);
      setIsStreaming(false);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (ythandle) {
      fetchWalletAddress();
      checkIfStreaming();
    }
  }, [ythandle]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!publicKey) {
      toast.error("Please connect your wallet.");
      return;
    }

    try {
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          //@ts-ignore
          toPubkey: walletAddr!,
          lamports: amount * 1_000_000_000, // Convert SOL to lamports (1 SOL = 1 billion lamports)
        })
      );

      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature);
      console.log("Transaction sent with signature:", signature);

      // Create chat after successful payment
      await axios.post("/api/create-superchat", { amount, name, message, ythandle });

      toast.success(`Payment of ${amount} SOL sent successfully and chat created!`);
    } catch (error) {
      console.error("Error processing transaction:", error);
      toast.error("Transaction failed. Please try again.");
    }
  };

  return (
    <div>
      <Toaster />
      <div className="m-4 text-center flex justify-around w-screen font-medium text-xl">
        <div>
          <span className="font-semibold">{ythandle}</span> {isStreaming ? "is streaming right now" : "is not streaming right now"}
        </div>
        <div>
          <WalletMultiButton />
        </div>
      </div>

      {!loading && isStreaming ? (
        <div className="flex items-center justify-between m-5 bg-gray-200 p-4 rounded-lg shadow-md">
          <div className="flex-shrink-0 h-96 w-96">
            <img src="/video-player-movie-svgrepo-com.svg" alt="Video Player" className="object-cover h-full w-full rounded-lg" />
          </div>
          <div className="flex-1 ml-8">
            <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
              <form className="my-8" onSubmit={handleSubmit}>
                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
                  <LabelInputContainer>
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Tyler" type="text" value={name} onChange={(e) => setName(e.target.value)} />
                  </LabelInputContainer>
                </div>
                <LabelInputContainer className="mb-4">
                  <Label htmlFor="message">Message</Label>
                  <Input id="message" placeholder="Message" type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
                </LabelInputContainer>
                <div className="flex justify-around m-5 ">
                  <Button type="button" onClick={() => setAmount(0.05)}>SOL 0.05</Button>
                  <Button type="button" onClick={() => setAmount(0.1)}>SOL 0.1</Button>
                  <Button type="button" onClick={() => setAmount(0.2)}>SOL 0.2</Button>
                </div>
                <button
                  className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                  type="submit"
                >
                  Send {amount} SOL
                  <BottomGradient />
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center text-lg font-medium text-gray-700 dark:text-gray-300">
          {loading ? "Checking streaming status..." : "Not Streaming Right Now"}
        </div>
      )}
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({ children, className }: { children: React.ReactNode; className?: string; }) => {
  return (
    <div className={`flex flex-col space-y-2 w-full ${className}`}>
      {children}
    </div>
  );
};
