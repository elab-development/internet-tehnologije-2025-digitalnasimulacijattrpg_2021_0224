'use client';

import { SubmitEvent, useState } from 'react';


type Body = {
    username: string;
    password: string;
    confirmPassword: string;
}

export default function SignUpPage(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = async (e: SubmitEvent) => {
        e.preventDefault();

    const res = await fetch('/api/sign-up/', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password, confirmPassword })
    });

    if (res.ok) {
        window.location.href = '/log-in/';
    } else {
        const data = await res.json();
        alert(`Error: ${data.error}`);
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
            className="w-full border px-3 py-2 "
            autoFocus
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
        <button type="submit" className="w-full bg-black border text-white py-2 hover:bg-pink-600">
            Create account
        </button>
    </form>
</div>
);
}