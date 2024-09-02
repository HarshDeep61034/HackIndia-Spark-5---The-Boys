import { RegisterLink, LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
export default function Page() {
    return (
        <main className="w-screen h-screen flex justify-center items-center">
            <button className="px-6 py-3 mx-4 hover:bg-white hover:text-black border-2 border-white rounded-lg">
            <LoginLink>Sign in</LoginLink>
            </button>
            <button className="px-6 py-3 mx-4 hover:bg-white hover:text-black border-2 border-white rounded-lg">
            <RegisterLink>Sign up</RegisterLink>
            </button>
        </main>
    );
}