import Image from 'next/image';
import React from 'react'

const Card = ({ productImage, productName, categoryName, price }) => {
    return (
        <div className='w-60 h-60 bg-white shadow-2xl rounded-2xl overflow-hidden'>
            <div className='relative w-60 h-35 overflow-hidden bg-gray-400'>
                <Image src={productImage} sizes='240px' alt={productName || "Product"} fill className='object-cover' />
            </div>

            <div className='py-2 px-4'>
                <h1>{productName || "Product Name"}</h1>
                <h1>{categoryName || "Category Name"}</h1>

                <button>{price || "Price"}</button>
            </div>

        </div>
    )
}

export default Card;