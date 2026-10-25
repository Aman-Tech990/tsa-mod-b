"use client";
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

const Login = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setIsLoading(true);
            const res = await axios.post("/api/login", formData);
            alert(res?.data?.message);
            localStorage.setItem("admin", JSON.stringify(res?.data?.admin));
            console.log(res?.data?.admin);
            setFormData({
                email: "",
                password: ""
            });
            router.replace("/admin/dashboard");
        } catch (error) {
            console.log(error?.response?.data?.message);
            alert(error?.response?.data?.message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div
            className="h-full w-full flex flex-col items-center justify-center"
        >

            <h1 className="my-4 text-xl font-bold">Login</h1>
            <form
                className="flex flex-col p-4 shadow-2xl rounded-2xl gap-6"
            >

                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    type="email"
                    placeholder="Enter email"
                    className="border p-2 rounded-xl"
                />

                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    type="text"
                    placeholder="Enter password"
                    className="border p-2 rounded-xl"
                />

                <button
                    type="button"
                    disabled={isLoading}
                    onClick={handleSubmit}
                    className="bg-blue-300 py-2 px-4 cursor-pointer rounded-2xl font-semibold hover:bg-blue-500 transition duration-200 active:scale-95"
                >
                    {isLoading ?
                        <div className="flex items-center justify-center gap-2">
                            <span className='animate-spin'><Loader2 /></span>
                            Loading
                        </div>
                        :
                        <span>Login</span>
                    }
                </button>
            </form>

        </div >
    )
}

export default Login;