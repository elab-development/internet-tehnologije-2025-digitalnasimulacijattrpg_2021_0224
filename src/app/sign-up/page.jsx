'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';


export default function SignUpPage(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    function handleSubmit(e) {
        e.preventDefault

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        

        }
    }  
return (
    <div className="min-h-screen flex items-center justify-center">
        <form 
            onSubmit={handleSubmit}
            className="w-full max-w-sm space-y-4 border  p-6 shadow-md"
        >
        <h1 className="text-2xl font-bold mb-4 text-center">Sign Up</h1>
        <input
            type="text"
            placeholder="Username"
            className="w-full border px-3  py-2 "
            onChange={(e) => setUsername(e.target.value)}

            required
        /> 
        <input
            type="password"
            placeholder="Password"
            className="w-full border px-3 py-2 "
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
        />
        <input
            type="password"
            placeholder="Confirm Password"
            className="w-full border px-3 py-2 " 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
        />
        <button type="submit" className="w-full bg-black-500 border text-white py-2 hover:bg-pink-600">
            Create account
        </button>
    </form>
</div>
);
        }


