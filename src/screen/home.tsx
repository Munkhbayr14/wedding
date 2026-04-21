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
import dans from "../other-image/thank you .png";
import musicSrc from "../music/Katawaredoki.mp3";
import leaf from "../other-image/leaf.png";
import longLeaf from "../other-image/longLeaf.png";
import longsLeaf from "../other-image/lognsLeaf.png";
import boxIcon from "../other-image/boxIcon.png";
import weddingBanner from "../other-image/weddingBanner.png";
import weddingDay from "../other-image/wedddingDay.png";
import weddingPhoto from "../other-image/weddingPhoto.png";
import SakuraFalling from "./SakuraFalling";
import WeddingCalendar from "./weddingCalendar";
import CoupleContact from "./coupleContact";

const AnimatePresence = FramerAnimatePresence as React.FC<{
  children?: React.ReactNode;
  mode?: "sync" | "wait" | "popLayout";
  initial?: boolean;
  onExitComplete?: () => void;
}>;

const GALLERY_IMAGES = [b_2, b_4, b_1, b_7, b_8, b_9, b_2, b_4, b_1];
const GUEST_MESSAGES_STORAGE_KEY = "wedding_guest_messages";

interface GuestMessage {
  id: number;
  name: string;
  message: string;
}

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [guestName, setGuestName] = useState("");
  const [guestMessage, setGuestMessage] = useState("");
  const [guestMessages, setGuestMessages] = useState<GuestMessage[]>(() => {
    try {
      const storedMessages = localStorage.getItem(GUEST_MESSAGES_STORAGE_KEY);
      if (!storedMessages) return [];
      const parsed = JSON.parse(storedMessages) as GuestMessage[];
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.warn("Failed to read guest messages from localStorage:", error);
      return [];
    }
  });
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

  const handleGuestMessageSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const name = guestName.trim();
      const message = guestMessage.trim();
      if (!name || !message) return;

      setGuestMessages((prev) => [
        { id: Date.now(), name, message },
        ...prev,
      ]);
      setGuestName("");
      setGuestMessage("");
    },
    [guestName, guestMessage],
  );

  useEffect(() => {
    try {
      localStorage.setItem(
        GUEST_MESSAGES_STORAGE_KEY,
        JSON.stringify(guestMessages),
      );
    } catch (error) {
      console.warn("Failed to save guest messages to localStorage:", error);
    }
  }, [guestMessages]);

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
                type="button"
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
                <button
                  type="button"
                  aria-label="Өмнөх зураг"
                  className="text-white/70 text-5xl leading-none active:scale-90 transition-transform"
                >
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
                <button
                  type="button"
                  aria-label="Дараах зураг"
                  className="text-white/70 text-5xl leading-none active:scale-90 transition-transform"
                >
                  ›
                </button>
              </div>

              <div className="absolute bottom-8 flex gap-2">
                {GALLERY_IMAGES.map((_, i) => (
                  <button
                    type="button"
                    aria-label={`${i + 1}-р зураг руу очих`}
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
              className="absolute inset-0 z-40 flex flex-col items-center justify-center text-center px-10"
              style={{ background: "#e7e7e7" }}
            >
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `url(${covers})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  opacity: 0.15,
                }}
              />

              <div className="relative z-10 flex flex-col items-center gap-2">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                  className="font-elegant font-thin tracking-widest text-[16px]"
                  style={{ color: "#a89880", letterSpacing: "0.15em" }}
                >
                  — Wedding Invitation —
                </motion.p>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  style={{
                    width: 40,
                    height: 1,
                    background: "#d4b89a",
                    margin: "6px 0",
                  }}
                />

                {/* <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="font-serif font-normal leading-relaxed"
                  style={{ color: "#5c4a3a", fontSize: 22 }}
                >
                  Барсбаатар
                  <br />
                  <span style={{ color: "#c9a882", fontSize: 16 }}>♥</span>
                  <br />
                  Одончимэг
                </motion.h1>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  style={{
                    width: 40,
                    height: 1,
                    background: "#d4b89a",
                    margin: "6px 0",
                  }}
                /> */}

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="font-elegant font-thin tracking-widest text-[12px]"
                  style={{ color: "#a89880" }}
                >
                  2026 · 03 · 28
                </motion.p>

                <motion.button
                  type="button"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  onClick={startExperience}
                  className="mt-8 font-elegant font-thin text-[18px] tracking-widest active:scale-95 transition-transform"
                  style={{
                    background: "transparent",
                    // border: "0.1px solid #c9a882",
                    color: "#8a6a50",
                    padding: "10px 28px",
                    borderRadius: 20,
                    letterSpacing: "0.12em",
                  }}
                >
                  Урилга нээх
                </motion.button>
              </div>

              <p
                className="absolute bottom-6 font-serif text-[11px] tracking-widest animate-pulse"
                style={{ color: "#c4ae95" }}
              >
                morning✨
              </p>
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
            className="relative w-full"
          >
            <img
              className="w-full h-auto object-cover"
              src={covers}
              alt="Wedding ceremony"
              loading="eager"
              decoding="async"
            />

            {/* Wedding day текст — зурагны дээр */}
            <div className="absolute -bottom-3.5 left-0 right-0 flex justify-center">
              <img
                src={weddingDay}
                alt="Wedding day"
                className="w-80 opacity-90"
              />
            </div>
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
                <h1 className="text-3xl text-gray-600"> Барсбаатарs </h1>
              </div>
              <span className="text-2xl text-[#f1a993] mx-1">♥</span>
              <div>
                <p className="flex text-[15px] justify-start text-gray-400">
                  Сүйт бүсгүй
                </p>
                <h1 className="text-3xl text-gray-600">Одончимэгs</h1>
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

          <div className="grid grid-cols-3 gap-1 p-4">
            {GALLERY_IMAGES.map((img, index) => (
              <motion.button
                type="button"
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
            type="button"
            whileTap={{ scale: 0.96 }}
            onClick={() => openGallery(0)}
            className="flex flex-col justify-center items-center mt-6 mx-auto px-10 py-2 border border-gray-400 text-gray-600 font-elegant font-thin text-sm tracking-wider"
          >
            Зураг харах +
          </motion.button>

          <div className="bg-white pt-3 h-auto w-full">
            <h1 className="flex font-elegant font-thin justify-center pt-10 text-[20px] mb-10">
              LOCATION
            </h1>
            <div className="w-full px-5 pb-5">
              <iframe
                title="Улаанбаатар зүүн чуулганы байршил"
                className="w-full rounded-2xl shadow-sm"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d10695.247020883977!2d106.95975198065267!3d47.920679739523756!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5d96911c8ad90ded%3A0x154015dc33d0e30a!2z0KPQu9Cw0LDQvdCx0LDQsNGC0LDRgCDQsdCw0L_RgtC40YHRgiDQt9Kv0q_QvSDRh9GD0YPQu9Cz0LDQvQ!5e0!3m2!1sen!2smn!4v1698212444861!5m2!1sen!2smn"
                height="300"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
            <p className=" font-elegant font-thin text-center text-[18px] mt-7">
              {" "}
              Улаанбаатар Зүүн чуулган{" "}
            </p>
            <p className=" font-elegant font-thin text-center  mb-12">
              3 давхар Их танхим
            </p>
          </div>

          <hr className="border-gray-200" />

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={showSplash ? { opacity: 0, y: 40 } : { opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="text-center text-gray-600 bg-white mt-16"
          >
            <div className="flex justify-center">
              <img
                className="w-32"
                src={longsLeaf}
                alt="leaf"
                loading="lazy"
                decoding="async"
              />
            </div>
          </motion.div>

          <WeddingCalendar />

          <CoupleContact />

          <motion.div
            {...getFadeInUp(scrollRef)}
            className=" mb-10 text-center"
          >
            <p className="font-elegant font-thin flex flex-auto italic justify-center items-center mt-10 mb-5">
              Барсбаатар♥Одончимэг
            </p>
            <img
              src={dans}
              alt="dans"
              className="w-full shadow-md"
              loading="lazy"
              decoding="async"
            />
          </motion.div>

          <section className="bg-white px-5 py-10">
            <h2 className="text-center font-elegant font-thin text-[22px] text-gray-700">
              Сэтгэгдэл
            </h2>
            <p className="text-center text-[13px] text-gray-400 mt-2 mb-6">
              Нэрээ бичээд ерөөл, сэтгэгдлээ үлдээгээрэй
            </p>

            <form
              onSubmit={handleGuestMessageSubmit}
              className="flex flex-col gap-3"
            >
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Таны нэр"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-[#e7b596]"
              />
              <textarea
                value={guestMessage}
                onChange={(e) => setGuestMessage(e.target.value)}
                placeholder="Сэтгэгдэл..."
                rows={4}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm resize-none outline-none focus:border-[#e7b596]"
              />
              <button
                type="submit"
                className="self-end px-5 py-2 border border-[#e7b596] text-[#8a6a50] rounded-md text-sm font-elegant font-thin active:scale-95 transition-transform"
              >
                Илгээх
              </button>
            </form>

            <div className="mt-6 space-y-3">
              {guestMessages.length === 0 ? (
                <p className="text-center text-sm text-gray-400">
                  Одоогоор сэтгэгдэл байхгүй байна.
                </p>
              ) : (
                guestMessages.map((item) => (
                  <div
                    key={item.id}
                    className="border border-gray-200 rounded-md px-3 py-3"
                  >
                    <p className="text-[13px] text-gray-500">{item.name}</p>
                    <p className="text-sm text-gray-700 mt-1 leading-relaxed">
                      {item.message}
                    </p>
                  </div>
                ))
              )}
            </div>
          </section>

          <div className="h-48 flex flex-col justify-center items-center text-gray-400 italic">
            <p>Thank you!</p>
            <p className="mt-2 text-red-200 text-xl">♥</p>
          </div>
        </div>

        {/* ── Music button ── */}
        <AnimatePresence>
          {!showSplash && (
            <motion.button
              type="button"
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
