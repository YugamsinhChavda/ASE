"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userCreation, setUserCreation] = useState(false);
    const [postCreation, setPostCreation] = useState(false);
    const [errorState, setErrorState] = useState(false);
    async function handleSubmit(ev) {
        ev.preventDefault();
        setUserCreation(true);
        setErrorState(false);
        setPostCreation(false);
        const response = await fetch('/api/register', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
            headers: { 'Content-Type': 'application/json' },
        });
        if(!response.ok){
            console.log(response);
            setErrorState(true);
        }
        else {
            setPostCreation(true);
        }
        setUserCreation(false);
    }

    return (
        <section className="mt-8">
            <h1 className="text-center text-primary text-4xl mb-4">
                Register
            </h1>
            {postCreation && (
                <div className="my-4 text-center">
                    User Created Successfully.<br /> <Link className="underlin" href={'/login'}>
                        Login</Link>!
                </div>
            )}
            {errorState && (
                <div className="my-4 text-center">
                    An Error occured!. <br />
                    please try again.
                </div>
            )}
            <form className="block max-w-xs mx-auto" onSubmit={handleSubmit}>
                <input type="email" placeholder="email" value={email} disabled={userCreation}
                    onChange={ev => setEmail(ev.target.value)} />
                <input type="password" placeholder="password" value={password} disabled={userCreation}
                    onChange={ev => setPassword(ev.target.value)} />
                <button type="submit" disabled={userCreation}>Register</button>
                <div className="my-4 text-center text-gray-500">
                    Login with provider
                </div>
                <button className="flex gap-4 justify-center">
                    <Image src={'/google.png'} alt={''} width={'24'} height={'24'}></Image>
                    Login with Google
                </button>
                <div className="text-center my-4 text-gray-500 border-t pt-4">
                    Already a user?{' '} 
                    <Link  className="underline" href={'/login'}>Login</Link>
                </div>
            </form>
        </section>
    );
}