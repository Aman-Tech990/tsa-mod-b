"use client";

import axios from 'axios';
import { Loader2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';

const Categories = () => {
    const router = useRouter();
    const [categories, setCategories] = useState([]);
    const [input, setInput] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCategory, setNewCategory] = useState("");
    const [isCreating, setIsCreating] = useState(false);

    const filteredCategories = categories.filter((category) => {
        return category.name.toLowerCase().includes(input.trim().toLowerCase());
    });

    const handleCreateCategory = async (e) => {
        e.preventDefault();

        if (!newCategory.trim()) {
            alert("Category name is required!");
            return;
        }

        try {
            setIsCreating(true);
            const res = await axios.post("/api/categories", { name: newCategory.trim() });
            console.log(res?.data);
            alert(res?.data?.message);
            await fetchCategories();
            setNewCategory("");
            setIsModalOpen(false);
        } catch (error) {
            console.log(error?.response?.data?.message || error.message);
            alert(error?.response?.data?.message || error.message);
        } finally {
            setIsCreating(false);
        }
    }

    const fetchCategories = async () => {
        try {
            const res = await axios.get("/api/categories");
            console.log(res?.data);
            setCategories(res?.data?.categories);
            // alert(res?.data?.message);
        } catch (error) {
            console.log(error?.response?.data?.message || error.message);
            alert(error?.response?.data?.message || error.message);
        }
    }

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <div>

            <div className='flex items-center justify-between my-5 px-4'>
                <h1
                    className="text-lg sm:text-xl font-bold"
                >
                    All Categories
                </h1>
                <input
                    id='input'
                    name="input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    type="text"
                    placeholder='Search Category'
                    className='px-4 py-2 border-2 border-blue-500 rounded-2xl focus:outline-none'
                />
            </div>

            <button
                onClick={() => setIsModalOpen(!isModalOpen)}
                className='px-4 py-2 bg-black font-semibold text-white hover:bg-blue-400 cursor-pointer transition duration-200 ease-in-out rounded-2xl mb-5'
            >
                + Add Category
            </button>

            {isModalOpen &&
                <div className='mb-5'>
                    <div className='bg-white shadow-2xl rounded-2xl flex flex-col justify-center p-4 gap-2 sm:w-[450px] relative'>

                        <button
                            onClick={() => setIsModalOpen(false)}
                            className='absolute top-5 right-5 cursor-pointer'
                        >
                            <X size={26} />
                        </button>

                        <h1 className='text-center font-semibold'>Add a new Category</h1>

                        <label htmlFor="categoryInput"
                            className='font-semibold px-2'
                        >
                            Category Name
                        </label>
                        <input
                            id='categoryInput'
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            type="text"
                            placeholder='Enter category'
                            className='px-4 py-2 border-2 border-blue-500 rounded-2xl focus:outline-none'
                        />

                        <div className='flex items-center gap-2 mt-2'>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className='px-4 py-2 bg-gray-400 font-semibold text-white cursor-pointer transition duration-200 ease-in-out rounded-2xl'
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateCategory}
                                type='button'
                                disabled={isCreating}
                                className='px-4 py-2 bg-blue-400 font-semibold text-white hover:bg-blue-700 cursor-pointer transition duration-200 ease-in-out rounded-2xl'
                            >
                                {isCreating ?
                                    <div className='flex items-center gap-2'>
                                        <Loader2 className='animate-spin' />
                                        <span>Creating category</span>
                                    </div>
                                    :
                                    <span>Create</span>
                                }
                            </button>
                        </div>
                    </div>
                </div>
            }

            <div className='w-full overflow-x-auto'>
                <table className='min-w-[700px] w-full bg-white/10 text-center'>
                    <thead>
                        <tr className='bg-blue-400'>
                            <th>Category ID</th>
                            <th>Name</th>
                            <th>Created At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCategories.length === 0 ?
                            <tr>
                                <td
                                    colSpan="4"
                                >
                                    <p className='pt-2 text-red-600 font-semibold text-center'>No categories found!</p>
                                </td>
                            </tr>
                            :
                            <>
                                {filteredCategories.map((category) => (
                                    <tr key={category.id} className='font-semibold'>
                                        <td>{category?.id}</td>
                                        <td>{category.name}</td>
                                        <td>{new Date(category.createdAt).toLocaleString()}</td>
                                        <td className='pt-2'>
                                            <div className='flex items-center justify-center gap-5'>
                                                <button
                                                    className='px-4 py-2 bg-black font-semibold text-white hover:bg-blue-400 cursor-pointer transition duration-200 ease-in-out rounded-2xl'
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className='px-4 py-2 bg-red-600 font-semibold text-white hover:bg-blue-400 cursor-pointer transition duration-200 ease-in-out rounded-2xl'
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
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

export default Categories;