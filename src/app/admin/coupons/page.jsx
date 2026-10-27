"use client";

import axios from 'axios';
import { Loader2, X } from 'lucide-react';
import React, { useEffect, useState } from 'react'

const Coupon = () => {

    const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [isFetchingAllCoupon, setIsFetchingAllCoupon] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);

    const [searchCouponInput, setSearchCouponInput] = useState("");
    const [allCoupons, setAllCoupons] = useState([]);

    const filteredCoupons = allCoupons.filter((coupon) => {
        return coupon.code.toLowerCase().includes(searchCouponInput.trim().toLowerCase());
    });

    const [formData, setFormData] = useState({
        code: "",
        discountType: "",
        discountValue: "",
        minOrderAmt: "",
        expiresAt: "",
        usageLimit: ""
    });

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    }

    const handleSubmit = async () => {
        try {
            setIsCreating(true);
            const res = await axios.post("/api/coupons", formData);
            console.log(res?.data);
            alert(res?.data?.message);
            setFormData({
                code: "",
                discountType: "",
                discountValue: "",
                minOrderAmt: "",
                expiresAt: "",
                usageLimit: ""
            });
            setIsCouponModalOpen(false);
            await fetchAllCoupons();
        } catch (error) {
            console.log(error?.response?.data?.message || error.message);
            alert(error?.response?.data?.message) || error.message;
        } finally {
            setIsCreating(false);
        }
    }

    const handleDelete = async (id) => {
        try {
            setIsDeleting(true);
            const res = await axios.delete(`/api/coupons/${id}/delete`);
            console.log(res?.data);
            alert(res?.data?.message);
            await fetchAllCoupons();
        } catch (error) {
            console.log(error?.response?.data?.message || error.message);
            alert(error?.response?.data?.message || error.message);
        } finally {
            setIsDeleting(false);
        }
    }

    const fetchAllCoupons = async () => {
        try {
            const res = await axios.get("/api/coupons");
            console.log(res?.data);
            // alert(res?.data?.message);
            setAllCoupons(res?.data?.coupons);
        } catch (error) {
            console.log(error?.response?.data?.message || error.message);
            alert(error?.response?.data?.message || error.message);
        } finally {
            setIsFetchingAllCoupon(false);
        }
    }

    useEffect(() => {
        fetchAllCoupons();
    }, []);

    return (
        <div className='mt-4 px-4'>

            {isDeleting &&
                <div className='flex items-center justify-center gap-2'>
                    <Loader2 className="animate-spin" />
                    <span className='text-red-600 font-semibold'>Deleting Coupon</span>
                </div>
            }

            <div className='flex items-center justify-between'>
                <h1 className='text-lg md:text-xl font-semibold md:font-semibold'>All Coupons</h1>
                <input
                    id='searchCoupon'
                    name='searchCoupon'
                    value={searchCouponInput}
                    onChange={(e) => setSearchCouponInput(e.target.value)}
                    type="text"
                    placeholder='Search Coupons'
                    className='px-4 py-2 border-2 border-blue-500 rounded-2xl'
                />
            </div>

            <button
                onClick={() => setIsCouponModalOpen(!isCouponModalOpen)}
                className='px-4 py-2 border-2 border-blue-500 font-semibold transition duration-200 ease-in-out hover:bg-blue-500 rounded-2xl cursor-pointer hover:text-white mt-4'
            >
                Create Coupon
            </button>

            {/* Coupon registration */}
            {isCouponModalOpen &&
                <div
                    className='sm:flex sm:items-center sm:justify-center my-4'
                >
                    <form className='relative bg-white rounded-2xl p-4 shadow-2xl sm:w-150'>

                        <button
                            onClick={() => setIsCouponModalOpen(false)}
                            className='absolute top-5 right-5 cursor-pointer'
                        >
                            <X size={24} />
                        </button>

                        <h1 className='font-bold text-lg text-center'>Coupon Registration</h1>

                        <div className='flex flex-col gap-3'>

                            <label htmlFor="code" className='font-semibold'>Code</label>
                            <input
                                id="code"
                                name="code"
                                value={formData.code}
                                onChange={handleChange}
                                type="text"
                                placeholder="Enter coupon code"
                                className="px-4 py-2 border-2 border-blue-500 focus:outline-none rounded-2xl"
                                required
                            />

                            <label htmlFor="discountType" className='font-semibold'>Discount Type</label>
                            <select
                                id="discountType"
                                name="discountType"
                                value={formData.discountType}
                                onChange={handleChange}
                                className='border-2 border-blue-500 px-4 py-2 rounded-2xl focus:outline-none cursor-pointer'
                            >
                                <option value="">Select Discount Type</option>
                                <option value="Fixed">Fixed</option>
                                <option value="Percent">Percent</option>
                            </select>

                            <label htmlFor="discountValue" className='font-semibold'>Discount Value</label>
                            <input
                                id="discountValue"
                                name="discountValue"
                                value={formData.discountValue}
                                onChange={handleChange}
                                type="number"
                                min="1"
                                placeholder="Enter coupon code"
                                className="px-4 py-2 border-2 border-blue-500 focus:outline-none rounded-2xl"
                                required
                            />

                            <label htmlFor="minOrderAmt" className='font-semibold'>Minimum order amount</label>
                            <input
                                id="minOrderAmt"
                                name="minOrderAmt"
                                value={formData.minOrderAmt}
                                onChange={handleChange}
                                type="number"
                                min="0"
                                placeholder="Enter coupon code"
                                className="px-4 py-2 border-2 border-blue-500 focus:outline-none rounded-2xl"
                                required
                            />

                            <label htmlFor="expiresAt" className='font-semibold'>Expires At</label>
                            <input
                                id="expiresAt"
                                name="expiresAt"
                                value={formData.expiresAt}
                                onChange={handleChange}
                                type="date"
                                placeholder="Enter expiry date"
                                className="px-4 py-2 border-2 border-blue-500 focus:outline-none rounded-2xl"
                                required
                            />

                            <label htmlFor="usageLimit" className='font-semibold'>Usage lImit</label>
                            <input
                                id="usageLimit"
                                name="usageLimit"
                                value={formData.usageLimit}
                                onChange={handleChange}
                                type="number"
                                min="1"
                                placeholder="Enter uasge limit"
                                className="px-4 py-2 border-2 border-blue-500 focus:outline-none rounded-2xl"
                                required
                            />

                            <button
                                type='button'
                                onClick={handleSubmit}
                                disabled={isCreating}
                                className='px-4 py-2 bg-black rounded-2xl text-white mt-4 cursor-pointer hover:bg-blue-400 transition duration-200 ease-in-out font-semibold'
                            >
                                {isCreating ?
                                    <div className='flex items-center justify-center gap-2'>
                                        <Loader2 className='animate-spin' />
                                        <span>Creating coupon</span>
                                    </div>
                                    :
                                    <span>Create coupon</span>
                                }
                            </button>

                        </div>

                    </form>
                </div>
            }


            {/* All Coupons */}
            <div className='mt-4 w-full overflow-x-auto'>

                <table className='w-full min-w-175'>
                    <thead>
                        <tr className='bg-blue-600 text-white'>
                            <th>Code</th>
                            <th>Type</th>
                            <th>Value</th>
                            <th>Min. Order</th>
                            <th>Expires At</th>
                            <th>Remaining Uses</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {isFetchingAllCoupon ?
                            <tr>
                                <td colSpan="7" className='text-center pt-3'>
                                    <span className='font-semibold text-red-600'>No Coupons available!</span>
                                </td>
                            </tr>
                            :
                            <>
                                {filteredCoupons.map((coupon) => (
                                    <tr key={coupon.id} className='font-semibold text-center'>
                                        <td className='pt-3'>{coupon.code}</td>
                                        <td>{coupon.discountType}</td>
                                        <td>{coupon.discountValue}</td>
                                        <td>{coupon.minOrderAmount}</td>
                                        <td>{new Date(coupon.expiresAt).toLocaleString()}</td>
                                        <td>{coupon.remainingUses}</td>
                                        <td className='pt-3'>
                                            <button
                                                type='button'
                                                onClick={() => handleDelete(coupon.id)}
                                                className='px-4 py-2 bg-red-600 rounded-2xl text-white cursor-pointer hover:bg-red-900 transition duration-200 ease-in-out'
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                                }
                            </>
                        }
                    </tbody>

                </table>

            </div>

        </div>
    )
}


export default Coupon;