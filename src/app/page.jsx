"use client";

import Card from '@/components/Card';
import React, { useEffect, useState } from 'react';

const Home = () => {

  const [isFetching, setIsFetching] = useState(false);

  const [products, setProducts] = useState([]);

  const fetchAllProducts = async () => {
    try {
      setIsFetching(true);
      const res = await fetch("/api/public/products", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });
      const data = await res.json();
      console.log(data?.products);
      setProducts(data?.products);

    } catch (error) {
      console.log(error?.response?.error?.message || error.message);
      alert(error?.response?.error?.message || error.message);
    } finally {
      setIsFetching(false);
    }
  }

  useEffect(() => {
    fetchAllProducts();
  }, []);

  return (
    <div
      className="h-full w-full"
    >
      <header className="text-2xl bg-amber-300">Home</header>

      <main>
        {products &&
          products.map((product) => (
            <div key={product.id}>
              <Card productImage={product.Image} productName={product.name} categoryName={product.category.name} price={product.price} />
            </div>
          ))
        }

      </main>

      <footer>Footer</footer>

    </div>
  )
}

export default Home;