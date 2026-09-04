import { useEffect, useState } from "react";
import { getBanners } from "../api/banners.js";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const BannerCarousel = () => {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [fadeKey, setFadeKey] = useState(0);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const data = await getBanners();
        setBanners(data.banners || []);
      } catch (error) {
        console.error("Failed to fetch banners:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  // Auto slide
  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [banners.length]);

  useEffect(() => {
    setFadeKey((prev) => prev + 1);
  }, [currentIndex]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const previousSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  if (loading) {
    return (
      <div className="w-full h-64 md:h-96 rounded-2xl bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 bg-[length:400%_100%] animate-[shimmer_1.6s_infinite_linear]" />
    );
  }

  if (banners.length === 0) {
    return null;
  }

  const banner = banners[currentIndex];

  const BannerContent = (
    <div className="group relative w-full h-64 md:h-96 overflow-hidden rounded-2xl shadow-md">
      <img
        key={fadeKey}
        src={banner.imageUrl}
        alt={banner.title || "MilkRoute banner"}
        className="h-full w-full object-cover animate-[fadeIn_0.6s_ease-out] transition-transform duration-[4000ms] ease-out group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

      {(banner.title || banner.subtitle) && (
        <div className="absolute inset-0 flex items-center">
          <div key={`text-${fadeKey}`} className="p-6 md:p-10 text-white max-w-xl animate-[slideUp_0.6s_ease-out]">
            {banner.title && (
              <h2 className="text-2xl md:text-4xl font-bold mb-2 drop-shadow-sm">
                {banner.title}
              </h2>
            )}

            {banner.subtitle && (
              <p className="text-sm md:text-lg text-white/90">{banner.subtitle}</p>
            )}
          </div>
        </div>
      )}

      {banners.length > 1 && (
        <>
          <button
            type="button"
            onClick={previousSlide}
            className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white opacity-0 backdrop-blur-sm transition-all duration-200 hover:bg-white/35 group-hover:opacity-100"
            aria-label="Previous banner"
          >
            <FiChevronLeft className="text-xl" />
          </button>

          <button
            type="button"
            onClick={nextSlide}
            className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white opacity-0 backdrop-blur-sm transition-all duration-200 hover:bg-white/35 group-hover:opacity-100"
            aria-label="Next banner"
          >
            <FiChevronRight className="text-xl" />
          </button>

          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
            {banners.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex ? "w-6 bg-white" : "w-2 bg-white/50 hover:bg-white/75"
                }`}
                aria-label={`Go to banner ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}


    </div>
  );

  if (banner.linkUrl) {
    return (
      <section className="w-full">
        <a
          href={banner.linkUrl}
          className="block"
          target={banner.linkUrl.startsWith("http") ? "_blank" : undefined}
          rel={banner.linkUrl.startsWith("http") ? "noopener noreferrer" : undefined}
        >
          {BannerContent}
        </a>
      </section>
    );
  }

  return <section className="w-full">{BannerContent}</section>;
};

export default BannerCarousel;