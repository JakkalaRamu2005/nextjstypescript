"use client"
import {useState} from 'react'
import { useSearchParams } from 'next/navigation'
import {useRouter} from "next/navigation"



export default function ResetPassword(){
    const [newPassword, setNewPassword] = useState("");
    const [msg, setMsg] = useState("");

    const router = useRouter();

    const searchParams = useSearchParams();

    const token = searchParams.get("token");

    
    const handleReset = async(e: any)=>{
        e.preventDefault();

        const res = await fetch("/api/reset-password", {
            method: "POST", 
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({token, newPassword}),
        });

        const data = await res.json();
        setMsg(data.message);

        router.push('/login');

        
        
    }

    return(
        <div>
            <h2>Reset Password</h2>

            <form onSubmit={handleReset}>
                <input type="text"
                placeholder='Enter new password'
                value={newPassword}
                onChange={(e)=>setNewPassword(e.target.value)}
                />
                <button>Reset Password</button>
            </form>
            <p>{msg}</p>
        </div>
    )
}