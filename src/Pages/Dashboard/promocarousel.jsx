import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const slide1 = new URL('../../assets/Images/slide-1.jpg', import.meta.url).href;
const slide2 = new URL('../../assets/Images/slide-2.jpg', import.meta.url).href;
const slide3 = new URL('../../assets/Images/slide-3.jpg', import.meta.url).href;

const slides = [
  {
    id: 1,
    title: "Comparte en familia",
    description: "Disfruta del entretenimiento juntos",
    image: slide1,
  },
  {
    id: 2,
    title: "Todas tus plataformas",
    description: "Gestiona Netflix, Disney+, HBO y mas",
    image: slide2,
  },
  {
    id: 3,
    title: "Ahorra compartiendo",
    description: "Divide los costos con amigos",
    image: slide3,
  },
];

export function PromoCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 4000);  // Cambia slide cada 4 segundos
    return () => clearInterval(interval);
  }, []);

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const slide = slides[currentIndex];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Promociones</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative w-full overflow-hidden rounded-lg">
          <div className="relative aspect-video w-full">
            <img
              src={slide.image}
              alt={slide.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <h3 className="font-semibold">{slide.title}</h3>
              <p className="text-sm text-white/80">{slide.description}</p>
            </div>
          </div>
          <button
            onClick={goToPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
            aria-label="Anterior"
          >
            ◀
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
            aria-label="Siguiente"
          >
            ▶
          </button>
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 w-2 rounded-full ${
                  index === currentIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}