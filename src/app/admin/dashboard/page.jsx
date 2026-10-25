"use client";

import AdminNavbar from '@/components/AdminNavbar';
import axios from 'axios';
import { CheckCircle, IndianRupee, Loader2, Package, ShoppingBag } from 'lucide-react';
import React, { useEffect, useState } from 'react'

const AdminDashBoard = () => {
    const orderList = [
        {
            id: 1,
            name: "someone",
            total: 10,
            status: "Active",
            createdAt: "2026-10-22 13:58:33.694"
        }, {
            id: 2,
            name: "another",
            total: 10,
            status: "Out_Of_Stock",
            createdAt: "2026-10-22 13:58:33.694"
        }
    ];

    const [cardData, setCardData] = useState({
        products: 0,
        active: 0,
        orders: 0,
        revenue: 0
    });
    const [orders, setOrders] = useState(orderList);
    const [isLoading, setIsLoading] = useState(false);

    const fetchProductCount = async () => {
        try {
            const res = await axios.get("/api/products/total");
            if (res?.data?.success) {
                setCardData((prev) => ({
                    ...prev,
                    products: res.data.total
                }));
            }
        } catch (error) {
            console.log(error?.response?.data?.message);
            alert(error?.response?.data?.message);
        }
    }
    const fetchOrderCount = async () => {
        try {
            const res = await axios.get("/api/orders/total");
            if (res?.data?.success) {
                setCardData((prev) => ({
                    ...prev,
                    orders: res.data.total
                }));
            }
        } catch (error) {
            console.log(error?.response?.data?.message);
            alert(error?.response?.data?.message);
        }
    }
    const fetchActiveProductCount = async () => {
        try {
            const res = await axios.get("/api/products/active");
            if (res?.data?.success) {
                setCardData((prev) => ({
                    ...prev,
                    active: res.data.activeCount
                }));
            }
        } catch (error) {
            console.log(error?.response?.data?.message);
            alert(error?.response?.data?.message);
        }
    }
    const fetchTotalRevenue = async () => {
        try {
            const res = await axios.get("/api/revenue/total");
            if (res?.data?.success) {
                setCardData((prev) => ({
                    ...prev,
                    revenue: res.data.totalRevenue
                }));
            }
        } catch (error) {
            console.log(error?.response?.data?.message);
            alert(error?.response?.data?.message);
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);

                await Promise.all([
                    fetchProductCount(),
                    fetchOrderCount(),
                    fetchTotalRevenue(),
                    fetchActiveProductCount()
                ]);

            } catch (error) {
                console.log(error?.response?.data?.message || error.message);
                alert(error?.response?.data?.message || error.message);
            } finally {
                setIsLoading(false);
            }
        }

        fetchData();
    }, []);

    return (
        <div className='h-full w-full'>

            {isLoading &&
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-white/10 backdrop-blur-2xl'>
                    <div className='flex items-center gap-2 my-5'>
                        <Loader2 className='animate-spin' />
                        <h1>Fetching data</h1>
                    </div>
                </div>
            }

            {/* CARD SECTION */}
            <div
                className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 p-4'
            >
                {/* Card 1 */}
                <div className="w-full bg-white/10 shadow-2xl p-4 rounded-2xl flex flex-col justify-start gap-5 hover:scale-105 transition ease-in duration-200 cursor-pointer">
                    <div className="flex flex-col justify-start gap-2">
                        <Package size={24} />
                        <p>Total Products : {cardData.products || 0} </p>
                    </div>

                    <hr />

                    <p>Products in Catalogue</p>
                </div>

                {/* Card 2 */}
                <div className='w-full bg-white/10 shadow-2xl p-4 rounded-2xl flex flex-col justify-start gap-5 hover:scale-105 transition ease-in duration-200 cursor-pointer'>
                    <div className="flex flex-col justify-start gap-2">
                        <CheckCircle size={24} />
                        <p>Active Products : {cardData.active || 0} </p>
                    </div>

                    <hr />

                    <p>Currently active</p>
                </div>

                {/* Card 3 */}
                <div className='w-full bg-white/10 shadow-2xl p-4 rounded-2xl flex flex-col justify-start gap-5 hover:scale-105 transition ease-in duration-200 cursor-pointer'>
                    <div className="flex flex-col justify-start gap-2">
                        <ShoppingBag size={24} />
                        <p>Total Orders : {cardData.orders || 0} </p>
                    </div>

                    <hr />

                    <p>Orders placed</p>
                </div>

                {/* Card 4 */}
                <div className='w-full bg-white/10 shadow-2xl p-4 rounded-2xl flex flex-col justify-start gap-5 hover:scale-105 transition ease-in duration-200 cursor-pointer'>
                    <div className="flex flex-col justify-start gap-2">
                        <IndianRupee size={24} />
                        <p>Total Revenue: {cardData.revenue || 0} </p>
                    </div>

                    <hr />

                    <p>Sum of final amounts</p>
                </div>
            </div>

            {/* RECENT ACTIVITIES SECTION */}
            <h2 className='font-bold my-2 text-center text-red-800'>RECENT ORDERS</h2>

            <div className='w-full overflow-x-auto'>
                <table className='w-full min-w-[700px]'>
                    <thead className='py-2 px-4'>
                        <tr className='bg-blue-300'>
                            <th>Order ID</th>
                            <th>Customer Name</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>CreatedAt</th>
                        </tr>
                    </thead>

                    <tbody className='w-full'>
                        {orders.length === 0 ?
                            <tr>
                                <td colSpan={5} className="text-center text-red-600 font-semibold pt-4">
                                    No orders found!
                                </td>
                            </tr>
                            :
                            <>
                                {orders.map((order) => (
                                    <tr key={order.id} className='text-center font-semibold'>
                                        <td className='pt-2'>{order.id}</td>
                                        <td>{order.name}</td>
                                        <td>{order.total}</td>
                                        <td>
                                            {order.status === "Active" ? <span className='text-green-800'>Active</span> : <span className='text-red-600'>{order.status}</span>}
                                        </td>
                                        <td suppressHydrationWarning>{new Date(order.createdAt).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </>
                        }
                    </tbody>
                </table>
            </div>

        </div>
    )
}

export default AdminDashBoard;