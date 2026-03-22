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
