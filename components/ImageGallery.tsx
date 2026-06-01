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
//     <Carousel className="w-full relative">
//       <CarouselContent>
//         {images.map((src, index) => (
//           <CarouselItem key={index}>
//             <div className="relative w-full h-[420px] md:h-[620px] rounded-xl overflow-hidden">
//               {/* Blurred background */}
//               <img
//                 src={src}
//                 alt=""
//                 aria-hidden="true"
//                 className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl brightness-75 saturate-150"
//               />

//               {/* Main image */}
//               <img
//                 src={src}
//                 alt={`House image ${index + 1}`}
//                 className="relative z-10 w-full h-full object-contain"
//               />
//             </div>
//           </CarouselItem>
//         ))}
//       </CarouselContent>
//       <CarouselPrevious className="left-3 z-20 bg-transparent border-2 border-white text-white hover:bg-white/20 hover:text-white h-10 w-10" />
//       <CarouselNext className="right-3 z-20 bg-transparent border-2 border-white text-white hover:bg-white/20 hover:text-white h-10 w-10" />
//     </Carousel>
//   );
// }

"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageGalleryProps {
  images: string[];
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  const [activeImg, setActiveImg] = useState(0);

  const prev = () => setActiveImg((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setActiveImg((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-gray-100">
        <img
          key={activeImg}
          src={images[activeImg]}
          alt={`House image ${activeImg + 1}`}
          className="w-full h-full object-cover transition-opacity duration-300"
        />

        {/* Prev / Next buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white flex items-center justify-center transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white flex items-center justify-center transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}

        {/* Dots indicator */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`h-1.5 rounded-full transition-all duration-200 ${
                  i === activeImg ? "w-5 bg-white" : "w-1.5 bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails — no border, no opacity */}
      {images.length > 1 && (
        <div className="flex gap-2">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setActiveImg(i)}
              className="flex-1 rounded-lg overflow-hidden aspect-[16/10]"
            >
              <img
                src={src}
                alt={`Thumbnail ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
