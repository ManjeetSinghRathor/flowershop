"use client";

import React from 'react'
import { useSearchParams } from 'next/navigation';


const SearchProducts = () => {
    const searchParams = useSearchParams();
    const query = searchParams.get("query");

  return (
    <div>
        Search Results
    </div>
  )
}

export default SearchProducts;