import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay, Navigation, Pagination } from "swiper";
import { Box, Image } from "@chakra-ui/react";
import "swiper/swiper-bundle.min.css";

SwiperCore.use([Autoplay, Pagination, Navigation]);

export function Slider({ images }) {
  return (
    <Box bg={"blackAlpha.300"} maxWidth={{base: "100%", md: "650px"}} mx="auto">
      {images.length > 0 && (
        <Swiper
          spaceBetween={0}
          slidesPerView={1}
          loop={images.length > 1}  
          autoplay={{ delay: 3000 }}
          pagination={{ clickable: true }}
        >
          {images.map((image) => (
            <SwiperSlide key={image.public_id}>
              <Image
                src={image.imageurl}
                maxW="100%"
                h="auto"   
                boxSize="100%"
                objectFit="cover"
                alt="Foto de la propiedad"
                className="swiper-image"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </Box>
  );
}
