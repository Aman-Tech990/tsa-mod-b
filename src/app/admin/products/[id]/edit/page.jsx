"use client";

import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const EditProduct = () => {
    const router = useRouter();
    const { id } = useParams();

    const [product, setProduct] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isPageLoading, setIsPageLoading] = useState(false);
    const [isUpdateLoading, setIsUpdateLoading] = useState(false);

    const handleChange = (e) => {
        setProduct((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0] || null;

        if (!file) return;

        setProduct((prev) => ({
            ...prev,
            [e.target.name]: file
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setIsUpdateLoading(true);

            const formData = new FormData();
            formData.append("name", product.name);
            formData.append("category", product.categoryId);
            formData.append("price", product.price);
            formData.append("stock", product.stock);
            formData.append("description", product.description);
            formData.append("status", product.status);

            if (formData.image) {
                formData.append("iamge", file);
            }

            const res = await axios.put(`/api/products/${id}/edit`, formData);
            alert(res?.data?.message);
            console.log(res?.data);
            router.replace("/admin/products");

        } catch (error) {
            console.log(error?.response?.data?.message || error.message);
            alert(error?.response?.data?.message || error.message);
        } finally {
            setIsUpdateLoading(false);
        }
    }

    const fetchData = async () => {
        try {
            setIsPageLoading(true);

            const [productRes, categoryRes] = await Promise.all([
                axios.get(`/api/products/${id}`),
                axios.get(`/api/categories`)
            ]);


            setProduct(productRes?.data?.product);
            setCategories(categoryRes?.data?.categories || []);

        } catch (error) {
            console.log(error?.response?.data?.message || error.message);
            alert(error?.response?.data?.message || error.message);
        } finally {
            setIsPageLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div
        >
            
            {isPageLoading &&
                <div className='fixed inset-0 z-50 bg-white/10 backdrop-blur-2xl flex items-center justify-center'>
                    <div className="flex items-center gap-3">
                        <Loader2 className="animate-spin" />
                        <h1>Loading Product...</h1>
                    </div>
                </div>

            }

            <form className='flex flex-col p-4 bg-white/10 shadow-2xl rounded-2xl mt-5'>

                <h1 className='text-lg font-bold text-blue-400 text-center mb-2'>Edit Product</h1>

                <label htmlFor="name" className='font-semibold'>Name</label>
                <input
                    id='name'
                    name='name'
                    value={product.name}
                    onChange={handleChange}
                    type="text"
                    className='px-4 py-2 border-2 border-blue-500 focus:outline-none rounded-2xl my-2'
                    placeholder='Enter Name'
                    required
                />

                <label htmlFor="category" className='font-semibold'>Category</label>
                <select
                    id='category'
                    name='category'
                    value={product.categoryId ?? ""}
                    onChange={handleChange}
                    className='px-4 py-2 border-2 border-blue-500 focus:outline-none rounded-2xl my-2 cursor-pointer'
                    placeholder='Enter category'
                    required
                >
                    <option value="" disabled>Select Category</option>

                    {/*  */}
                    {categories && categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>

                <label htmlFor="price" className='font-semibold'>Price</label>
                <input
                    id='price'
                    name='price'
                    value={product.price}
                    onChange={handleChange}
                    type="number"
                    min="0"
                    className='px-4 py-2 border-2 border-blue-500 focus:outline-none rounded-2xl my-2'
                    placeholder='Enter price'
                    required
                />

                <label htmlFor="stock" className='font-semibold'>Stock</label>
                <input
                    id='stock'
                    name='stock'
                    value={product.stock}
                    onChange={handleChange}
                    type="number"
                    min="0"
                    className='px-4 py-2 border-2 border-blue-500 focus:outline-none rounded-2xl my-2'
                    placeholder='Enter stock'
                    required
                />

                <label htmlFor="description" className='font-semibold'>Description</label>
                <textarea
                    id='description'
                    name='description'
                    value={product.description}
                    onChange={handleChange}
                    type="text"
                    className='px-4 py-2 border-2 border-blue-500 focus:outline-none rounded-2xl my-2'
                    placeholder='Enter description'
                />

                <label htmlFor="image" className='font-semibold'>Image</label>
                <input
                    id='image'
                    name='image'
                    onChange={handleFileChange}
                    type="file"
                    accept='image/jpeg, image/png'
                    className='px-4 py-2 border-2 border-blue-500 focus:outline-none rounded-2xl my-2'
                    placeholder='Enter Name'
                />

                <label htmlFor="status" className='font-semibold'>Status</label>
                <select
                    name="status"
                    id="status"
                    value={product.status}
                    onChange={handleChange}
                    className='px-4 py-2 border-2 border-blue-500 focus:outline-none rounded-2xl my-2 cursor-pointer'
                    required
                >
                    <option value="Active">Active</option>
                    <option value="Out_of_Stock">Out of Stock</option>
                    <option value="Hidden">Hidden</option>
                </select>

                <button
                    type='button'
                    disabled={isUpdateLoading}
                    onClick={handleSubmit}
                    className='px-4 py-2 bg-black rounded-2xl text-white font-semibold my-4 hover:bg-blue-500 cursor-pointer transition -all duration-300 ease-in-out'
                >
                    {isUpdateLoading ?
                        <div className='flex items-center justify-center gap-2'>
                            <Loader2 className='animate-spin' />
                            <span>Updating Product...</span>
                        </div>
                        :
                        <span>Update Product</span>
                    }
                </button>

            </form>
        </div>
    )
}

export default EditProduct;