"use client";

import axios from 'axios';
import { Loader2, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const AdminNavbar = () => {
    const router = useRouter();
    const [admin, setAdmin] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isChecking, setIsChecking] = useState(true);
    const [menuOpen, SetMenuOpen] = useState(false);

    useEffect(() => {
        try {
            const storedAdmin = localStorage.getItem("admin");

            if (storedAdmin) {
                setAdmin(JSON.parse(storedAdmin));
            }
        } catch (error) {
            localStorage.removeItem("admin");
            setAdmin(null);
        } finally {
            setIsChecking(false);
        }
    }, []);

    const handleLogout = async () => {
        try {
            setIsLoading(true);
            const res = await axios.post("/api/logout");
            alert(res?.data?.message);

            localStorage.removeItem("admin");
            router.replace("/admin/login");
        } catch (error) {
            console.log(error?.response?.data?.message);
            alert(error?.response?.data?.message);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (!isChecking && !admin) {
            router.replace("/admin/login");
        }
    }, [isChecking, admin]);

    if (isChecking || !admin) {
        <div className="min-h-20 flex items-center justify-center">
            <Loader2 size={22} className="animate-spin" />
        </div>
    }


    return (
        <>
            <div className="bg-white/20 backdrop-blur-2xl p-4 flex flex-row items-center justify-between rounded-2xl shadow-2xl border-white/10">
                <Link href="/admin/dashboard">
                    <h1 className="text-xl font-bold">OhoShop</h1>
                </Link>

                <div className='hidden sm:flex sm:flex-row items-center gap-4'>

                    <ul className='flex sm:flex-row items-center gap-4 font-semibold'>
                        <Link href="/admin/dashboard" className='hover:text-blue-500 hover:scale-110 transition ease-in'>
                            <li>Dashboard</li>
                        </Link>
                        <Link href="/admin/products" className='hover:text-blue-500 hover:scale-110 transition ease-in'>
                            <li>Products</li>
                        </Link>
                        <Link href="/admin/categories" className='hover:text-blue-500 hover:scale-110 transition ease-in'>
                            <li>Categories</li>
                        </Link>
                        <Link href="/admin/coupons" className='hover:text-blue-500 hover:scale-110 transition ease-in'>
                            <li>Coupons</li>
                        </Link>
                        <Link href="/admin/orders" className='hover:text-blue-500 hover:scale-110 transition ease-in'>
                            <li>Orders</li>
                        </Link>

                    </ul>

                    <button
                        type="button"
                        disabled={isLoading}
                        onClick={handleLogout}
                        className="py-2 px-4 bg-black text-white rounded-2xl font-semibold cursor-pointer hover:bg-blue-500 active:scale-95"
                    >
                        {isLoading ?
                            <div className="flex items-center justify-center gap-2">
                                <span className="animate-spin"><Loader2 /></span>
                                <span>Logging out</span>
                            </div>
                            :
                            <span>Log out</span>
                        }
                    </button>

                    {admin &&
                        <div className='rounded-full border-2 py-2 font-bold px-4 cursor-pointer'><span>{admin?.name?.charAt(0).toUpperCase()}</span></div>
                    }
                </div>

                <div className='sm:hidden'>
                    <span
                        onClick={() => SetMenuOpen(!menuOpen)}
                    >
                        {menuOpen ?
                            <X size={22} className='font-bold' />
                            :
                            <Menu size={22} className='font-bold' />
                        }
                    </span>
                </div>




            </div>


            {/* MOBILE NAVBAR */}
            {
                menuOpen &&
                <>
                    <aside className='sm:hidden fixed font-2xl font-bold top-0 right-0 w-[75vw] bg-blue-100 p-6 h-screen flex flex-col gap-6 shadow-2xl z-10'>

                        <h1
                            className='text-xl'
                        >
                            OhoShop
                        </h1>

                        <ul className='flex flex-col justify-center gap-4 font-semibold'>
                            <Link href="/admin/dashboard" className='hover:text-blue-500 hover:scale-110 transition ease-in'>
                                <li>Dashboard</li>
                            </Link>
                            <Link href="/admin/products" className='hover:text-blue-500 hover:scale-110 transition ease-in'>
                                <li>Products</li>
                            </Link>
                            <Link href="/admin/categories" className='hover:text-blue-500 hover:scale-110 transition ease-in'>
                                <li>Categories</li>
                            </Link>
                            <Link href="/admin/coupons" className='hover:text-blue-500 hover:scale-110 transition ease-in'>
                                <li>Coupons</li>
                            </Link>
                            <Link href="/admin/orders" className='hover:text-blue-500 hover:scale-110 transition ease-in'>
                                <li>Orders</li>
                            </Link>
                        </ul>

                        <button
                            type="button"
                            disabled={isLoading}
                            onClick={handleLogout}
                            className="py-2 px-4 bg-black text-white rounded-2xl font-semibold cursor-pointer hover:bg-blue-500 active:scale-95"
                        >
                            {isLoading ?
                                <div className="flex items-center justify-center gap-2">
                                    <span className="animate-spin"><Loader2 /></span>
                                    <span>Logging out</span>
                                </div>
                                :
                                <span>Log out</span>
                            }
                        </button>

                        <div className='absolute right-4'>
                            <span
                                onClick={() => SetMenuOpen(!menuOpen)}
                            >
                                {menuOpen ?
                                    <X size={22} className='font-bold' />
                                    :
                                    <Menu size={22} className='font-bold' />
                                }
                            </span>
                        </div>
                    </aside>
                </>

            }
        </>

    )
}

export default AdminNavbar;