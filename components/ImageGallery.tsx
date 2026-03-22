// // "use client";
// // import Image, { StaticImageData } from "next/image";
// // import { useState } from "react";

// // interface ImageGalleryProps {
// //   images: string[];
// // }

// // const ImageGallery = ({ images }: ImageGalleryProps) => {
// //   const [bigImage, setBigImage] = useState(images[0]);

// //   const handleSmallImageClick = (image: string) => {
// //     setBigImage(image);
// //   };

// //   return (
// //     <div className="grid gap-4 lg:grid-cols-5">
// //       {/* Thumbnails */}
// //       <div className="order-last flex gap-4 lg:order-0 lg:flex-col">
// //         {images.map((image, index) => (
// //           <div key={index} className="overflow-hidden rounded-lg bg-gray-100">
// //             <Image
// //               src={image}
// //               width={200}
// //               height={200}
// //               alt="photo"
// //               className="h-full w-full object-cover object-center cursor-pointer"
// //               onClick={() => handleSmallImageClick(image)}
// //             />
// //           </div>
// //         ))}
// //       </div>

// //       {/* Big Image */}
// //       <div className="relative overflow-hidden rounded-lg bg-gray-100 lg:col-span-4">
// //         <Image
// //           src={bigImage}
// //           width={500}
// //           height={500}
// //           alt="photo"
// //           className="h-full w-full object-cover object-center"
// //         />
// //         <span className="absolute left-0 top-0 rounded-br-lg bg-red-500 px-3 py-1.5 text-sm uppercase tracking-wider text-white">
// //           Sale
// //         </span>
// //       </div>
// //     </div>
// //   );
// // };

// // export default ImageGallery;

// // components/ImageGallery.tsx
// "use client";
// import Image from "next/image";
// import { useState } from "react";

// interface ImageGalleryProps {
//   images: string[];
// }

// const ImageGallery = ({ images }: ImageGalleryProps) => {
//   const [bigImage, setBigImage] = useState(images[0]);

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
//               alt={`House image ${index + 1}`}
//               className="h-full w-full object-cover object-center cursor-pointer"
//               onClick={() => setBigImage(image)}
//             />
//           </div>
//         ))}
//       </div>

//       {/* Big Image */}
//       <div className="relative overflow-hidden rounded-md bg-gray-100 lg:col-span-4">
//         <Image
//           src={bigImage}
//           width={500}
//           height={500}
//           alt="House main photo"
//           className="h-full w-full object-cover object-center"
//         />
//       </div>
//     </div>
//   );
// };

// export default ImageGallery;

// "use client";

// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
// } from "@/components/ui/carousel";

// interface ImageGalleryProps {
//   images: string[];
// }

// export default function ImageGallery({ images }: ImageGalleryProps) {
//   return (
//     <Carousel className="w-full">
//       <CarouselContent>
//         {images.map((src, index) => (
//           <CarouselItem key={index}>
//             <img
//               src={src}
//               alt={`House image ${index + 1}`}
//               className="w-full h-[350px] md:h-[480px] object-cover rounded-xl"
//             />
//           </CarouselItem>
//         ))}
//       </CarouselContent>
//       <CarouselPrevious className="left-3" />
//       <CarouselNext className="right-3" />
//     </Carousel>
//   );
// }

// "use client";

// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
// } from "@/components/ui/carousel";

// interface ImageGalleryProps {
//   images: string[];
// }

// export default function ImageGallery({ images }: ImageGalleryProps) {
//   return (
//     <Carousel className="w-full">
//       <CarouselContent>
//         {images.map((src, index) => (
//           <CarouselItem key={index}>
//             <div className="w-full h-[320px] md:h-[500px] bg-black rounded-xl flex items-center justify-center">
//               <img
//                 src={src}
//                 alt={`House image ${index + 1}`}
//                 className="w-full h-full object-contain rounded-xl"
//               />
//             </div>
//           </CarouselItem>
//         ))}
//       </CarouselContent>
//       <CarouselPrevious className="left-3" />
//       <CarouselNext className="right-3" />
//     </Carousel>
//   );
// }

// "use client";

// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
// } from "@/components/ui/carousel";

// interface ImageGalleryProps {
//   images: string[];
// }

// export default function ImageGallery({ images }: ImageGalleryProps) {
//   return (
//     <Carousel className="w-full">
//       <CarouselContent>
//         {images.map((src, index) => (
//           <CarouselItem key={index}>
//             <div className="relative w-full h-[320px] md:h-[500px] rounded-xl overflow-hidden">
//               {/* Blurred background — same image, stretched to fill */}
//               <img
//                 src={src}
//                 alt=""
//                 aria-hidden="true"
//                 className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl brightness-75 saturate-150"
//               />

//               {/* Frosted glass overlay */}
//               <div className="absolute inset-0 backdrop-blur-sm bg-white/10" />

//               {/* Actual image — contained, no cropping */}
//               <img
//                 src={src}
//                 alt={`House image ${index + 1}`}
//                 className="relative z-10 w-full h-full object-contain"
//               />
//             </div>
//           </CarouselItem>
//         ))}
//       </CarouselContent>
//       <CarouselPrevious className="left-3" />
//       <CarouselNext className="right-3" />
//     </Carousel>
//   );
// }

"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface ImageGalleryProps {
  images: string[];
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  return (
    <Carousel className="w-full relative">
      <CarouselContent>
        {images.map((src, index) => (
          <CarouselItem key={index}>
            <div className="relative w-full h-[420px] md:h-[620px] rounded-xl overflow-hidden">
              {/* Blurred background */}
              <img
                src={src}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl brightness-75 saturate-150"
              />

              {/* Main image */}
              <img
                src={src}
                alt={`House image ${index + 1}`}
                className="relative z-10 w-full h-full object-contain"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-3 z-20 bg-transparent border-2 border-white text-white hover:bg-white/20 hover:text-white h-10 w-10" />
      <CarouselNext className="right-3 z-20 bg-transparent border-2 border-white text-white hover:bg-white/20 hover:text-white h-10 w-10" />
    </Carousel>
  );
}
