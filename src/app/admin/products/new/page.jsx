"use client";

import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react'

const NewProduct = () => {
    const router = useRouter();
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        category: "",
        price: "",
        stock: "",
        description: "",
        image: null,
        status: "Active"
    });

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0] || null;

        setFormData((prev) => ({
            ...prev,
            image: file
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setIsLoading(true);
            const data = new FormData();
            data.append("name", formData.name);
            data.append("category", formData.category);
            data.append("price", formData.price);
            data.append("stock", formData.stock);
            data.append("description", formData.description);
            data.append("status", formData.status);

            if (formData.image) {
                data.append("image", formData.image);
            }

            const res = await axios.post("/api/products", data);
            console.log(res.data);
            alert(res.data?.message);

            setFormData({
                name: "",
                category: "",
                price: "",
                stock: "",
                description: "",
                image: null,
                status: "Active"
            });
            router.replace("/admin/products");

        } catch (error) {
            console.log(error?.response?.data?.message || error.message);
            alert(error?.response?.data?.message || error.message);
        } finally {
            setIsLoading(false);
        }
    }

    const getCategories = async () => {
        try {
            const res = await axios.get("/api/categories");
            console.log(res?.data?.message);
            setCategories(res?.data?.categories);
        } catch (error) {
            console.log(error?.response?.data?.message || error.message);
            alert(error?.response?.data?.message || error.message);
        }
    }

    useEffect(() => {
        getCategories();
    }, []);

    return (
        <div
        >

            <form className='flex flex-col p-4 bg-white/10 shadow-2xl rounded-2xl mt-5'>

                <h1 className='text-lg font-bold text-blue-400 text-center mb-2'>Add a new Product</h1>

                <label htmlFor="name" className='font-semibold'>Name</label>
                <input
                    id='name'
                    name='name'
                    value={formData.name}
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
                    value={formData.category}
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
                    value={formData.price}
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
                    value={formData.stock}
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
                    value={formData.description}
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
                    value={formData.status}
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
                    disabled={isLoading}
                    onClick={handleSubmit}
                    className='px-4 py-2 bg-black rounded-2xl text-white font-semibold my-4 hover:bg-blue-500 cursor-pointer transition -all duration-300 ease-in-out'
                >
                    {isLoading ?
                        <div className='flex items-center justify-center gap-2'>
                            <Loader2 className='animate-spin' />
                            <span>Adding Product...</span>
                        </div>
                        :
                        <span>Add a new Product</span>
                    }
                </button>

            </form>

        </div>
    )
}

export default NewProduct;