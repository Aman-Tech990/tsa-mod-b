"use client";

import axios from 'axios';
import { Loader, Loader2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';

const Categories = () => {
    const router = useRouter();
    const [categories, setCategories] = useState([]);
    const [input, setInput] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCategory, setNewCategory] = useState("");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentCategoryUpdate, setCurrentCategoryUpdate] = useState(null);
    const [selectedID, setSelectedID] = useState(null);

    const [isCreating, setIsCreating] = useState(false);
    const [isOpeningEdit, setIsOpeningEdit] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isdeleting, setIsDeleteting] = useState(false);

    const filteredCategories = categories.filter((category) => {
        return category.name.toLowerCase().includes(input.trim().toLowerCase());
    });

    const handleEditCategory = async (id) => {
        setSelectedID(id);
        try {
            setIsOpeningEdit(true);
            const res = await axios.get(`/api/categories/${id}`);
            console.log(res?.data);
            setCurrentCategoryUpdate(res?.data?.category?.name);
            setIsEditModalOpen(true);
        } catch (error) {
            console.log(error?.response?.data?.message || error.message);
            alert(error?.response?.data?.message || error.message);
        } finally {
            setIsOpeningEdit(false);
        }
    }

    const handleEditSubmission = async () => {
        try {
            setIsUpdating(true);
            const res = await axios.put(`/api/categories/${selectedID}/edit`, { name: currentCategoryUpdate });
            console.log(res?.data);
            alert(res?.data?.message);
            setIsEditModalOpen(false);
            await fetchCategories();
        } catch (error) {
            console.log(error?.response?.data?.message || error.message);
            alert(error?.response?.data?.message || error.message);
        } finally {
            setIsUpdating(false);
        }
    }

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

    const handleDeleteCategory = async (id) => {

        const confirmed = window.confirm("Are you sure to delete this category?");

        if (!confirmed) {
            return;
        }
        
        try {
            setIsDeleteting(true);
            const res = await axios.delete(`/api/categories/${id}/delete`);
            console.log(res?.data);
            alert(res?.data?.message);
            await fetchCategories();
        } catch (error) {
            console.log(error?.response?.data?.message || error.message);
            alert(error?.response?.data?.message || error.message);
        } finally {
            setIsDeleteting(false);
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

            {isOpeningEdit &&
                <div className='w-full flex items-center justify-center gap-2 mt-5'>
                    <Loader2 className='animate-spin' />
                    <p className='font-semibold text-lg text-blue-600'>Opening Edit Modal</p>
                </div>
            }

            {isdeleting &&
                <div className='w-full flex items-center justify-center gap-2 mt-5'>
                    <Loader2 className='animate-spin' />
                    <span className='font-semibold text-lg text-red-600'>Deleting category</span>
                </div>
            }

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

            {/* Add Category */}
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

            {/* Edit Category */}
            {isEditModalOpen &&
                <div className='mb-5'>
                    <div className='bg-white shadow-2xl rounded-2xl flex flex-col justify-center p-4 gap-2 sm:w-[450px] relative'>

                        <button
                            onClick={() => setIsEditModalOpen(false)}
                            className='absolute top-5 right-5 cursor-pointer'
                        >
                            <X size={26} />
                        </button>

                        <h1 className='text-center font-semibold'>Edit Category</h1>

                        <label htmlFor="categoryInput"
                            className='font-semibold px-2'
                        >
                            Category Name
                        </label>
                        <input
                            id='categoryInput'
                            value={currentCategoryUpdate}
                            onChange={(e) => setCurrentCategoryUpdate(e.target.value)}
                            type="text"
                            placeholder='Enter category'
                            className='px-4 py-2 border-2 border-blue-500 rounded-2xl focus:outline-none'
                        />

                        <div className='flex items-center gap-2 mt-2'>
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className='px-4 py-2 bg-gray-400 font-semibold text-white cursor-pointer transition duration-200 ease-in-out rounded-2xl'
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEditSubmission}
                                type='button'
                                disabled={isUpdating}
                                className='px-4 py-2 bg-blue-400 font-semibold text-white hover:bg-blue-700 cursor-pointer transition duration-200 ease-in-out rounded-2xl'
                            >
                                {isUpdating ?
                                    <div className='flex items-center gap-1'>
                                        <Loader2 className='animate-spin' />
                                        <span>Updating category</span>
                                    </div>
                                    :
                                    <span>Update</span>
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
                                {filteredCategories.map((category, idx) => (
                                    <tr key={category.id} className='font-semibold'>
                                        <td>{idx + 1}</td>
                                        <td>{category.name}</td>
                                        <td>{new Date(category.createdAt).toLocaleString()}</td>
                                        <td className='pt-2'>
                                            <div className='flex items-center justify-center gap-5'>
                                                <button
                                                    type='button'
                                                    onClick={() => handleEditCategory(category.id)}
                                                    className='px-4 py-2 bg-black font-semibold text-white hover:bg-blue-400 cursor-pointer transition duration-200 ease-in-out rounded-2xl'
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    type='button'
                                                    onClick={() => handleDeleteCategory(category.id)}
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