import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import './GalleryCarousel.css';

// Cloudflare Images URLs
const images = [
  {
    id: '9ec62152-8fa6-4361-28de-8a94b7a3d700',
    alt: 'Bakey Bakey VI cake creation 1'
  },
  {
    id: 'a4cb53d1-67a7-493e-8429-f818287b6800',
    alt: 'Bakey Bakey VI cake creation 2'
  },
  {
    id: '1e283288-4c32-4fae-e781-12655a2b7000',
    alt: 'Bakey Bakey VI cake creation 3'
  },
  {
    id: 'fc1aed7a-1f3e-4a5b-a56f-c5d6a308c800',
    alt: 'Bakey Bakey VI cake creation 4'
  },
  {
    id: 'd6e1efbb-830d-427a-3cb2-12598252b300',
    alt: 'Bakey Bakey VI cake creation 5'
  },
  {
    id: 'a5c25e2c-2234-4e90-148d-b7f9226a9d00',
    alt: 'Bakey Bakey VI cake creation 6'
  },
  {
    id: 'c880db1b-1827-4eb0-4d8e-16c625cc6400',
    alt: 'Bakey Bakey VI cake creation 7'
  },
  {
    id: '3e387852-3c34-4668-3928-d6f3b58dae00',
    alt: 'Bakey Bakey VI cake creation 8'
  }
];

function GalleryCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goToSlide = (index) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  const openLightbox = (index) => {
    setIsAutoPlaying(false);
    setLightboxIndex(index);
  };

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  const showPrevInLightbox = useCallback((e) => {
    e && e.stopPropagation();
    setLightboxIndex((prev) => (prev - 1 + images.length) % images.length);
  }, []);

  const showNextInLightbox = useCallback((e) => {
    e && e.stopPropagation();
    setLightboxIndex((prev) => (prev + 1) % images.length);
  }, []);

  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showPrevInLightbox();
      if (e.key === 'ArrowRight') showNextInLightbox();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [lightboxIndex, closeLightbox, showPrevInLightbox, showNextInLightbox]);

  return (
    <section id="gallery" className="gallery-carousel">
      <div className="section-container">
        <span className="section-label">The Proof</span>
        <h2 className="section-title">Cakes That Get Photographed Before They Get Eaten</h2>
        <p className="section-subtitle">
          A look at what's come out of the kitchen lately — every one plant-based, every one baked to order.
        </p>

        <div className="carousel-container">
          <button
            className="carousel-button prev"
            onClick={goToPrevious}
            aria-label="Previous image"
          >
            <ChevronLeft size={24} />
          </button>

          <div className="carousel-track">
            <div
              className="carousel-slides"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {images.map((image, index) => (
                <button
                  key={index}
                  type="button"
                  className="carousel-slide carousel-slide-button"
                  onClick={() => openLightbox(index)}
                  aria-label={`View ${image.alt} full screen`}
                >
                  <img
                    srcSet={`
                      https://imagedelivery.net/lzEB4WEiwuaDooGpiwwqdQ/${image.id}/w=400 400w,
                      https://imagedelivery.net/lzEB4WEiwuaDooGpiwwqdQ/${image.id}/w=600 600w,
                      https://imagedelivery.net/lzEB4WEiwuaDooGpiwwqdQ/${image.id}/w=800 800w,
                      https://imagedelivery.net/lzEB4WEiwuaDooGpiwwqdQ/${image.id}/w=1200 1200w
                    `}
                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 80vw, 1000px"
                    src={`https://imagedelivery.net/lzEB4WEiwuaDooGpiwwqdQ/${image.id}/public`}
                    alt={image.alt}
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          </div>

          <button
            className="carousel-button next"
            onClick={goToNext}
            aria-label="Next image"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        <div className="carousel-dots">
          {images.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>

        <p className="gallery-note">
          All baked goods images are authentic with some light editing for
          presentation
        </p>
      </div>

      {lightboxIndex !== null && (
        <div
          className="gallery-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={images[lightboxIndex].alt}
          onClick={closeLightbox}
        >
          <button
            type="button"
            className="lightbox-close"
            onClick={closeLightbox}
            aria-label="Close full screen image"
          >
            <X size={28} />
          </button>

          <button
            type="button"
            className="lightbox-nav lightbox-prev"
            onClick={showPrevInLightbox}
            aria-label="Previous image"
          >
            <ChevronLeft size={32} />
          </button>

          <img
            className="lightbox-image"
            src={`https://imagedelivery.net/lzEB4WEiwuaDooGpiwwqdQ/${images[lightboxIndex].id}/w=1600`}
            srcSet={`
              https://imagedelivery.net/lzEB4WEiwuaDooGpiwwqdQ/${images[lightboxIndex].id}/w=800 800w,
              https://imagedelivery.net/lzEB4WEiwuaDooGpiwwqdQ/${images[lightboxIndex].id}/w=1200 1200w,
              https://imagedelivery.net/lzEB4WEiwuaDooGpiwwqdQ/${images[lightboxIndex].id}/w=1600 1600w,
              https://imagedelivery.net/lzEB4WEiwuaDooGpiwwqdQ/${images[lightboxIndex].id}/w=2000 2000w
            `}
            sizes="95vw"
            alt={images[lightboxIndex].alt}
            onClick={(e) => e.stopPropagation()}
          />

          <button
            type="button"
            className="lightbox-nav lightbox-next"
            onClick={showNextInLightbox}
            aria-label="Next image"
          >
            <ChevronRight size={32} />
          </button>

          <div className="lightbox-counter">
            {lightboxIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </section>
  );
}

export default GalleryCarousel;
