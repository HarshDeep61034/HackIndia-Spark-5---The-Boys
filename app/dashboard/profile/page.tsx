"use client";

import React, { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { cn } from "../../lib/utils";
import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";

export default function SignupFormDemo() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userHandle, setUserHandle] = useState("");
  const { user, isAuthenticated, isLoading } = useKindeAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const myPromise = axios.post("/api/updateUser", {
      id: user?.id, // Pass the user ID here
      firstName: firstName,
      lastName: lastName,
      userHandle: userHandle,
    });

    toast.promise(myPromise, {
      loading: "Updating Profile...",
      success: "Profile Updated Successfully!",
      error: "Failed to Update Profile!",
    });

    try {
      const response = await myPromise;
      console.log("User updated successfully:", response.data);
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <Toaster />
      <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
        <img
          src={user?.picture}
          alt="Profile Pic"
          className="mx-auto mb-4 rounded-full"
          style={{ maxWidth: "250px", maxHeight: "250px" }}
        />

        <h2 className="font-bold text-3xl text-neutral-800 dark:text-neutral-200">
          Edit Your Profile
        </h2>

        <p className="text-neutral-600 text-lg max-w-sm mt-2 dark:text-neutral-300">
          Add your YT handle to get started with superchat Streaming!!
        </p>

        <form className="my-8" onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
            <LabelInputContainer>
              <Label htmlFor="firstname">First name</Label>
              <Input
                id="firstname"
                placeholder="Tyler"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </LabelInputContainer>
            <LabelInputContainer>
              <Label htmlFor="lastname">Last name</Label>
              <Input
                id="lastname"
                placeholder="Durden"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </LabelInputContainer>
          </div>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="userHandle">User Handle</Label>
            <Input
              id="userHandle"
              placeholder="@projectmayhem"
              type="text"
              value={userHandle}
              onChange={(e) => setUserHandle(e.target.value)}
            />
          </LabelInputContainer>

          <button
            className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
            type="submit"
          >
            Save Changes &rarr;
            <BottomGradient />
          </button>

          <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
        </form>
      </div>
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

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
