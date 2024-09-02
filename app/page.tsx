"use client"
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <main className="flex justify-center min-h-screen w-screen items-center">
          <button onClick={()=>router.push("/auth")} className="px-6 py-3 mx-4 hover:bg-white hover:text-black border-2 border-white rounded-lg">
            Get Started
            </button>
    </main>
  );
}
