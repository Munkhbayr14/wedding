import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  motion,
  AnimatePresence as FramerAnimatePresence,
} from "framer-motion";
import b_1 from "../barsaa/b-1.jpg";
import b_2 from "../barsaa/b-2.jpg";
import b_4 from "../barsaa/b-4.jpg";
import b_7 from "../barsaa/b-7.jpg";
import b_8 from "../barsaa/b-8.jpg";
import b_9 from "../barsaa/b-9.jpg";
import covers from "../barsaa/covers.jpg";
import dans from "../barsaa/dans.png";
import musicSrc from "../music/Katawaredoki.mp3";
import leaf from "../other-image/leaf.png";
import longLeaf from "../other-image/longLeaf.png";
import boxIcon from "../other-image/boxIcon.png";
import weddingBanner from "../other-image/weddingBanner.png";
import weddingPhoto from "../other-image/weddingPhoto.png";
import SakuraFalling from "./SakuraFalling";

const AnimatePresence = FramerAnimatePresence as React.FC<{
  children?: React.ReactNode;
  mode?: "sync" | "wait" | "popLayout";
  initial?: boolean;
  onExitComplete?: () => void;
}>;

const GALLERY_IMAGES = [b_2, b_4, b_1, b_7, b_8, b_9, b_2, b_4, b_1];

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const touchStartX = useRef<number>(0);

  const getFadeInUp = (ref: React.RefObject<HTMLDivElement>) => ({
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-50px", root: ref },
    transition: { duration: 0.8, ease: "easeOut" },
  });

  const startExperience = useCallback(() => {
    setShowSplash(false);
    setIsPlaying(true);
    audioRef.current?.play().catch((err) => {
      console.warn("Audio autoplay blocked:", err);
      setIsPlaying(false);
    });
  }, []);

  const toggleMusic = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch((err) => console.warn("Audio play blocked:", err));
      setIsPlaying(true);
    }
  }, [isPlaying]);

  const openGallery = useCallback((index: number) => {
    setActiveIndex(index);
    setShowGallery(true);
  }, []);

  const closeGallery = useCallback(() => setShowGallery(false), []);

  const prevImage = useCallback(
    () =>
      setActiveIndex(
        (i) => (i - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length,
      ),
    [],
  );

  const nextImage = useCallback(
    () => setActiveIndex((i) => (i + 1) % GALLERY_IMAGES.length),
    [],
  );

  useEffect(() => {
    if (!showGallery) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "Escape") closeGallery();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [showGallery, prevImage, nextImage, closeGallery]);

  useEffect(() => {
    document.body.style.overflow = showGallery ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showGallery]);

  return (
    <div className="h-screen w-full bg-gray-200 flex justify-center items-center overflow-hidden">
      <div className="relative w-full max-w-[450px] h-full md:h-[92vh] bg-white md:rounded-[2.5rem] md:shadow-2xl overflow-hidden border-x border-gray-100 flex flex-col">
        {!showSplash && <SakuraFalling />}

        <audio ref={audioRef} src={musicSrc} loop preload="none" />

        {/* ── Modal Lightbox ── */}
        <AnimatePresence>
          {showGallery && (
            <motion.div
              key="modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0 z-50 bg-black/90 flex flex-col items-center justify-center"
              onClick={closeGallery}
              onTouchStart={(e) => {
                touchStartX.current = e.touches[0].clientX;
              }}
              onTouchEnd={(e) => {
                const diff = touchStartX.current - e.changedTouches[0].clientX;
                if (diff > 50) nextImage();
                if (diff < -50) prevImage();
              }}
            >
              <button
                className="absolute top-5 right-5 text-white text-3xl leading-none z-10"
                onClick={closeGallery}
                aria-label="Хаах"
              >
                ×
              </button>

              <p className="absolute top-6 left-0 right-0 text-center text-white/50 text-sm">
                {activeIndex + 1} / {GALLERY_IMAGES.length}
              </p>

              <motion.img
                key={activeIndex}
                src={GALLERY_IMAGES[activeIndex]}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="max-h-[75vh] max-w-[90%] rounded-xl object-contain shadow-2xl"
                onClick={(e) => e.stopPropagation()}
                alt={"Wedding ceremony"}
                loading="eager"
              />

              <div
                className="absolute inset-y-0 left-0 w-1/4 flex items-center justify-start pl-3"
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
              >
                <button className="text-white/70 text-5xl leading-none active:scale-90 transition-transform">
                  ‹
                </button>
              </div>

              <div
                className="absolute inset-y-0 right-0 w-1/4 flex items-center justify-end pr-3"
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
              >
                <button className="text-white/70 text-5xl leading-none active:scale-90 transition-transform">
                  ›
                </button>
              </div>

              <div className="absolute bottom-8 flex gap-2">
                {GALLERY_IMAGES.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveIndex(i);
                    }}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === activeIndex
                        ? "bg-[#e7b596] scale-125"
                        : "bg-white/40"
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showSplash && (
            <motion.div
              key="splash"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-[#fcf5eb] px-10 text-center"
            >
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="italic font-serif text-[#7f838c] mb-2"
              >
                Wedding Invitation
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-3xl font-serif text-gray-700 mb-8"
              >
                Барсбаатар & Одончимэг
              </motion.h1>
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                onClick={startExperience}
                className="px-10 py-3 bg-[#e7b596] text-white rounded-full font-serif shadow-lg active:scale-95 transition-transform"
              >
                Урилга нээх ♥
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto no-scrollbar scroll-smooth"
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={showSplash ? { opacity: 0, y: 40 } : { opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
          >
            <img
              className="w-full h-auto object-cover"
              src={covers}
              alt="Wedding ceremony"
              loading="eager"
              decoding="async"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={showSplash ? { opacity: 0, y: 40 } : { opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="px-5 pt-16 text-center font-elegant font-thin"
          >
            <p className="italic text-[15px]">2026оны 03сарын 28өдөр 11:30</p>
            <div className="py-10 flex items-end justify-center">
              <div>
                <p className="flex text-[15px] justify-end text-gray-400">
                  Сүйт залуу
                </p>
                <h1 className="text-3xl text-gray-600">bilguun</h1>
              </div>
              <span className="text-2xl text-[#f1a993] mx-1">♥</span>
              <div>
                <p className="flex text-[15px] justify-start text-gray-400">
                  Сүйт бүсгүй
                </p>
                <h1 className="text-3xl text-gray-600">urnaa</h1>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={showSplash ? { opacity: 0, y: 40 } : { opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="text-center text-gray-600 bg-white"
          >
            <div className="flex justify-center">
              <img
                className="w-12"
                src={leaf}
                alt="leaf"
                loading="lazy"
                decoding="async"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={showSplash ? { opacity: 0, y: 40 } : { opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="mt-10 text-gray-600 bg-white"
          >
            <img
              className="w-full h-auto"
              src={weddingBanner}
              alt="wedding banner"
              loading="lazy"
              decoding="async"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={showSplash ? { opacity: 0, y: 40 } : { opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="mt-14 font-serif text-gray-600 bg-white"
          >
            <div className="flex justify-center">
              <img
                className="w-6"
                src={boxIcon}
                alt="box icon"
                loading="lazy"
                decoding="async"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={showSplash ? { opacity: 0, y: 40 } : { opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="mt-10 font-elegant font-thin text-gray-600 bg-white px-6"
          >
            <p className="text-center leading-relaxed">
              Итгэлээр түшиглэн, хайраар холбогдсон бид хоёрын
              <br /> амьдралын хамгийн нандин энэ мөчид <br /> эрхэм таныг
              хүндэтгэлтэйгээр урьж байна.
              <br /> Бид бие биеэ энэрэн хайрлаж, талархан нандигнаж,
              <br /> аз жаргалаар дүүрэн амьдралыг хамтдаа бүтээнэ.
              <br /> Таны үнэт оролцоо, халуун ерөөл бидний ирээдүйг гэрэлтүүлэн
              <br /> адислах тул энэ баярт мөчийг бидэнтэй хамт хуваалцана
              <br /> гэдэгт чин сэтгэлээсээ баярлах болно.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={showSplash ? { opacity: 0, y: 40 } : { opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="my-14 font-serif text-gray-600 bg-white"
          >
            <div className="flex justify-center">
              <img
                className="w-14"
                src={longLeaf}
                alt="leaf"
                loading="lazy"
                decoding="async"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={showSplash ? { opacity: 0, y: 40 } : { opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
          >
            <img
              className="w-full h-auto object-cover"
              src={covers}
              alt="covers bro"
              loading="lazy"
              decoding="async"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={showSplash ? { opacity: 0, y: 40 } : { opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="text-center p-12 font-elegant font-thin text-gray-600 bg-white"
          >
            <p className="text-xl text-[#f1c3b4] mb-4">♥</p>
            <p>2025 оны 11-р сарын 01</p>
            <p>Улаанбаатар зүүн чуулган</p>
            <p>10:00 цагт</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={showSplash ? { opacity: 0, y: 40 } : { opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="my-8 font-serif text-gray-600 bg-white"
          >
            <div className="flex justify-center">
              <img
                className="w-24"
                src={weddingPhoto}
                loading="lazy"
                alt="Wedding ceremony"
                decoding="async"
              />
            </div>
          </motion.div>

          <motion.div
            {...getFadeInUp(scrollRef)}
            className="bg-[#fcf5eb] p-10 text-center text-gray-500 italic"
          >
            <p className="text-sm font-serif leading-relaxed">
              "Хайр тэвчээртэй энэрэнгүй билээ... Хайр хэзээ ч дуусдаггүй."
            </p>
            <p className="mt-4 font-bold not-italic text-[10px] tracking-widest text-gray-400">
              1 КОРИНТ 13:4-8
            </p>
          </motion.div>

          {/* ── Gallery 3×3 ── */}
          <h2 className="font-serif text-center py-8 text-2xl text-gray-700">
            ♥ Зураг ♥
          </h2>

          <div className="grid grid-cols-3 gap-1">
            {GALLERY_IMAGES.map((img, index) => (
              <motion.button
                key={index}
                onClick={() => openGallery(index)}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, root: scrollRef }}
                transition={{
                  delay: Math.min(index * 0.05, 0.3),
                  duration: 0.4,
                }}
                className="relative aspect-square overflow-hidden active:scale-95 transition-transform"
              >
                {/* 9. Gallery зурагнуудад lazy — scroll хүрэхэд л татна */}
                <img
                  src={img}
                  alt={"Wedding ceremony"}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </motion.button>
            ))}
          </div>

          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => openGallery(0)}
            className="mt-6 mx-4 w-[calc(100%-2rem)] py-3 border border-[#e7b596] text-[#e7b596] rounded-full font-serif text-sm tracking-wider hover:bg-[#e7b596] hover:text-white transition-colors"
          >
            Бүх зургийг үзэх ♥
          </motion.button>

          <motion.div
            {...getFadeInUp(scrollRef)}
            className="mx-6 p-8 bg-white border border-gray-100 rounded-2xl shadow-sm mb-6 mt-6"
          >
            <h2 className="text-center font-serif text-xl mb-6 text-gray-700">
              Холбоо барих
            </h2>
            <div className="space-y-4 font-serif">
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-400">Барсбаатар</span>
                <a
                  href="tel:94004499"
                  className="text-[#e7b596] font-bold"
                  aria-label="Барсбаатарт залгах"
                >
                  94004499
                </a>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-400">Одончимэг</span>
                <a
                  href="tel:89399879"
                  className="text-[#e7b596] font-bold"
                  aria-label="Одончимэгт залгах"
                >
                  89399879
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div
            {...getFadeInUp(scrollRef)}
            className="px-5 mb-10 text-center"
          >
            <h2 className="font-serif mb-4 text-gray-500">Бэлэг дурсгал</h2>
            <img
              src={dans}
              alt="dans"
              className="w-full rounded-2xl shadow-md"
              loading="lazy"
              decoding="async"
            />
          </motion.div>

          <div className="h-48 flex flex-col justify-center items-center text-gray-400 italic">
            <p>Thank you!</p>
            <p className="mt-2 text-red-200 text-xl">♥</p>
          </div>
        </div>

        {/* ── Music button ── */}
        <AnimatePresence>
          {!showSplash && (
            <motion.button
              key="music-btn"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={toggleMusic}
              aria-label={isPlaying ? "Дуу зогсоох" : "Дуу тоглуулах"}
              className="absolute bottom-10 right-6 z-40 w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-[#e7b596] flex items-center justify-center transition-all active:scale-90"
            >
              {isPlaying ? (
                <div className="flex gap-1 items-end h-4">
                  <div className="w-1 bg-[#e7b596] animate-music-bar" />
                  <div className="w-1 bg-[#e7b596] animate-music-bar [animation-delay:0.2s]" />
                  <div className="w-1 bg-[#e7b596] animate-music-bar [animation-delay:0.4s]" />
                </div>
              ) : (
                <span className="text-[10px] font-bold text-gray-400 uppercase">
                  Off
                </span>
              )}
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
