"use client";
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const Product = () => {

    const router = useRouter();

    const [products, setProducts] = useState([]);
    const [input, setInput] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    const filteredProducts = products.filter((prod) => (
        prod.name.toLowerCase().includes(input.trim().toLowerCase())
    ));

    const handleDelete = async (id) => {
        const confirmed = window.confirm("Are you sure you want to delete this product?");

        if (!confirmed) {
            return;
        }

        try {
            setIsDeleting(true);
            const res = await axios.delete(`/api/products/${id}/delete`);
            alert(res?.data?.message);
            console.log(res?.data?.message);
            fetchProducts();
        } catch (error) {
            console.log(error?.response?.data?.message || error?.message);
            alert(error?.response?.data?.message || error.message);
        } finally {
            setIsDeleting(false);
        }
    }

    const fetchProducts = async () => {
        try {
            const res = await axios.get("/api/products");
            console.log(res?.data?.message);
            setProducts(res?.data?.products || []);
        } catch (error) {
            console.log(error?.response?.data?.message || error.message);
        }
    }

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <div className='mt-6'>

            {isDeleting &&
                <div className='flex items-center justify-center gap-2 bg-white/10'>
                    <Loader2 className='animate-spin' />
                    <span>Deleting Product</span>
                </div>
            }

            <div className='flex flex-row items-center justify-between mb-5 sm:px-4'>
                <h1 className='text-lg md:text-xl font-bold'>All Products</h1>
                <input
                    name='input'
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    type="text"
                    placeholder='Search Product'
                    className='px-4 py-2 border-2 border-blue-500 rounded-2xl focus:outline-none'
                />
            </div>

            <button
                type="button"
                onClick={() => router.push("/admin/products/new")}
                className="px-4 py-2 rounded-2xl bg-black m-4 text-white font-semibold hover:bg-blue-400 transition duration-200 cursor-pointer"
            >
                Add New Product
            </button>

            <div className='w-full overflow-x-auto'>
                <table className='w-full min-w-[700px]'>
                    <thead className='py-2 px-4'>
                        <tr className='bg-blue-300'>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Status</th>
                            <th>CreatedAt</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody className='w-full'>
                        {filteredProducts.length === 0 ?
                            <tr>
                                <td colSpan={7} className="text-center text-red-600 font-semibold pt-4">
                                    No products found!
                                </td>
                            </tr>
                            :
                            <>
                                {filteredProducts.map((product) => (
                                    <tr key={product.id} className='text-center font-semibold'>
                                        <td className='pt-2'>{product.name}</td>
                                        <td>{product.category.name}</td>
                                        <td>{product.price}</td>
                                        <td>{product.stock}</td>
                                        <td>
                                            {product.status === "Active" ? <span className='text-green-700'>Active</span> : <span className='text-red-600'>{product.status}</span>}
                                        </td>
                                        <td suppressHydrationWarning>{new Date(product.createdAt).toLocaleString()}</td>
                                        <td>
                                            <div className='flex items-center justify-center gap-4 py-2'>
                                                <button
                                                    onClick={() => {
                                                        router.push(`/admin/products/${product.id}/edit`)
                                                    }}
                                                    className='bg-black text-white cursor-pointer px-4 py-2 rounded-2xl font-semibold hover:bg-blue-400'
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className='bg-red-600 text-white cursor-pointer px-4 py-2 rounded-2xl font-semibold hover:bg-blue-400'
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

export default Product;