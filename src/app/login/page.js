"use client";
import { useState } from "react";
import Image from "next/image";
import { signIn } from "next-auth/react";

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userLoginProcess, setUserLoginProcess] = useState(false);

    async function handleSubmit(ev) {
        ev.preventDefault();
        setUserLoginProcess(true);

        await signIn('credentials', {email, password, callbackUrl: '/'});
        setUserLoginProcess(false);
    }

    return (
        <section className="mt-8">
            <h1 className="text-center text-primary text-4xl mb-4">
                Login
            </h1>
            <form className="max-w-xs mx-auto" onSubmit={handleSubmit}>
                <input type="email" name="email" placeholder="email" value={email} disabled={userLoginProcess}
                    onChange={ev => setEmail(ev.target.value)} />
                <input type="password" name="password" placeholder="password" value={password} disabled={userLoginProcess}
                    onChange={ev => setPassword(ev.target.value)} />
                <button disabled={userLoginProcess} type="submit">Login</button>
                <div className="my-4 text-center text-gray-500">
                    Login with provider
                </div>
                <button className="flex gap-4 justify-center">
                    <Image src={'/google.png'} alt={''} width={'24'} height={'24'}></Image>
                    Login with Google
                </button>
            </form>
        </section>
    );
}
