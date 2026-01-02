import React from 'react'
import Image from 'next/image';

const CakesBLMHVN = () => {
  return (
    <div className="min-h-[90vh]">
        
            <div className='flex w-full px-2 sm:px-8 lg:px-24 items-center justify-center py-4'>
                <div className="relative w-full h-[50vh] rounded-lg overflow-hidden">
                    <Image
                        src="/no_product.png"
                        alt="No Product Available"
                        fill
                        className="object-contain"
                        decoding="async"
                        sizes="100vw"
                    />
                </div>
            </div>
            
    </div>
  )
}

export default CakesBLMHVN