'use client';

import { SubmitEvent, useState } from 'react';


export default function LogIn(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');


    const handleSubmit = async (e: SubmitEvent) => {
        e.preventDefault();

    const res = await fetch('/api/log-in/', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    if (res.ok) {
        window.location.href = '/home'; 
    } else {
        alert("Failed to log in");
    }
}
return (
    <div className="min-h-screen flex items-center justify-center">
        <form 
            onSubmit={handleSubmit}
            className="w-full max-w-sm space-y-4 border  p-6 shadow-md"
        >
        <h1 className="text-2xl font-bold mb-4 text-center">Log in</h1>
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
        <button type="submit" className="w-full bg-black border text-white py-2 hover:bg-pink-500">
            Log in now
        </button>
    </form>
</div>
);

}