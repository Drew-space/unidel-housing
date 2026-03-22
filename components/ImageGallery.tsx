// "use client";
// import Image, { StaticImageData } from "next/image";
// import { useState } from "react";

// interface ImageGalleryProps {
//   images: string[];
// }

// const ImageGallery = ({ images }: ImageGalleryProps) => {
//   const [bigImage, setBigImage] = useState(images[0]);

//   const handleSmallImageClick = (image: string) => {
//     setBigImage(image);
//   };

//   return (
//     <div className="grid gap-4 lg:grid-cols-5">
//       {/* Thumbnails */}
//       <div className="order-last flex gap-4 lg:order-0 lg:flex-col">
//         {images.map((image, index) => (
//           <div key={index} className="overflow-hidden rounded-lg bg-gray-100">
//             <Image
//               src={image}
//               width={200}
//               height={200}
//               alt="photo"
//               className="h-full w-full object-cover object-center cursor-pointer"
//               onClick={() => handleSmallImageClick(image)}
//             />
//           </div>
//         ))}
//       </div>

//       {/* Big Image */}
//       <div className="relative overflow-hidden rounded-lg bg-gray-100 lg:col-span-4">
//         <Image
//           src={bigImage}
//           width={500}
//           height={500}
//           alt="photo"
//           className="h-full w-full object-cover object-center"
//         />
//         <span className="absolute left-0 top-0 rounded-br-lg bg-red-500 px-3 py-1.5 text-sm uppercase tracking-wider text-white">
//           Sale
//         </span>
//       </div>
//     </div>
//   );
// };

// export default ImageGallery;

// components/ImageGallery.tsx
"use client";
import Image from "next/image";
import { useState } from "react";

interface ImageGalleryProps {
  images: string[];
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [bigImage, setBigImage] = useState(images[0]);

  return (
    <div className="grid gap-4 lg:grid-cols-5">
      {/* Thumbnails */}
      <div className="order-last flex gap-4 lg:order-0 lg:flex-col">
        {images.map((image, index) => (
          <div key={index} className="overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={image}
              width={200}
              height={200}
              alt={`House image ${index + 1}`}
              className="h-full w-full object-cover object-center cursor-pointer"
              onClick={() => setBigImage(image)}
            />
          </div>
        ))}
      </div>

      {/* Big Image */}
      <div className="relative overflow-hidden rounded-md bg-gray-100 lg:col-span-4">
        <Image
          src={bigImage}
          width={500}
          height={500}
          alt="House main photo"
          className="h-full w-full object-cover object-center"
        />
      </div>
    </div>
  );
};

export default ImageGallery;
