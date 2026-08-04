import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  motion,
  AnimatePresence as FramerAnimatePresence,
} from "framer-motion";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  limit,
  type DocumentData,
  type QueryDocumentSnapshot,
  type Timestamp,
} from "firebase/firestore";
import b_1 from "../barsaa/b-1.jpg";
import b_2 from "../barsaa/b-2.jpg";
import b_4 from "../barsaa/b-4.jpg";
import b_7 from "../barsaa/b-7.jpg";
import b_8 from "../barsaa/b-8.jpg";
import b_9 from "../barsaa/b-9.jpg";
import covers from "../barsaa/covers.jpg";
import dans from "../other-image/thank you .png";
import musicSrc from "../music/UI.mp3";
import { db, isFirebaseConfigured } from "../firebase";
import SakuraFalling from "./SakuraFalling";
import WeddingCalendar from "./weddingCalendar";
import CoupleContact from "./coupleContact";

/* ────────────────────────────────────────────────────────────
   ЗАСВАРЛАХ УТГА (нэр, огноо, байршил) — энд өөрчилнө
──────────────────────────────────────────────────────────── */
const CONFIG = {
  groom: "Мөнхбаяр",
  bride: "Үүрийнтуяа",
  dateLabel: "2026 · 09 · 12",
  dayLabel: "Saturday · 10:30",
  venueTitle: "Улаанбаатар Зүүн чуулган",
  venueSub: "3 давхар, Их танхим",
};

const PALETTE = {
  paper: "#FBF7F2",
  greige: "#F1E9E0",
  blush: "#E7CFC7",
  rose: "#C08A7D",
  roseDeep: "#A9705F",
  mauve: "#6E5A52",
  ink: "#514842",
  muted: "#9A8B81",
  sage: "#9AA487",
  line: "#E4D8CD",
};

/* Хуучин font-elegant-ийг эх контейнерээс өвлүүлнэ */
const FONT = {
  display: "inherit",
  accent: "inherit",
  body: "inherit",
};

const GALLERY_IMAGES = [b_2, b_4, b_1, b_7, b_8, b_9, b_2, b_4, b_1];

const COMMENTS_COLLECTION = "guest-comments";

type CommentItem = {
  id: string;
  name: string;
  message: string;
  createdAt?: Timestamp | Date | null;
};

const AnimatePresence = FramerAnimatePresence as React.FC<{
  children?: React.ReactNode;
  mode?: "sync" | "wait" | "popLayout";
  initial?: boolean;
  onExitComplete?: () => void;
}>;

/* Scroll хийхэд зөөлөн гарч ирэх reveal */
const Reveal: React.FC<{
  children: React.ReactNode;
  root: React.RefObject<HTMLDivElement>;
  className?: string;
  delay?: number;
  y?: number;
}> = ({ children, root, className, delay = 0, y = 28 }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-40px", root }}
    transition={{ duration: 1, ease: [0.2, 0.7, 0.2, 1], delay }}
  >
    {children}
  </motion.div>
);

/* Ботаник тусгаарлагч зураас */
const Divider: React.FC<{ small?: boolean }> = ({ small }) => (
  <div
    className="flex items-center justify-center gap-3.5 mx-auto"
    style={{ padding: small ? "30px 0" : "46px 0" }}
  >
    <span
      style={{
        width: 52,
        height: 1,
        background: `linear-gradient(90deg,transparent,${PALETTE.line},transparent)`,
      }}
    />
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke={PALETTE.sage}
      strokeWidth="1.1"
      style={{ opacity: 0.9 }}
    >
      <path
        d="M12 21c0-6 3-9 8-10-5-1-8-4-8-9 0 5-3 8-8 9 5 1 8 4 8 10z"
        strokeLinejoin="round"
      />
    </svg>
    <span
      style={{
        width: 52,
        height: 1,
        background: `linear-gradient(90deg,transparent,${PALETTE.line},transparent)`,
      }}
    />
  </div>
);

const Eyebrow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p
    className="text-center"
    style={{
      fontFamily: FONT.accent,
      letterSpacing: "0.4em",
      textTransform: "uppercase",
      fontSize: 12,
      color: PALETTE.rose,
      fontWeight: 500,
    }}
  >
    {children}
  </p>
);

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [commentName, setCommentName] = useState("");
  const [commentMessage, setCommentMessage] = useState("");
  const [commentStatus, setCommentStatus] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number>(0);

  /* Хөгжим: эхлээд дуутай autoplay оролдоно. Хориглогдвол ДУУГҮЙ autoplay
     (бүх браузер зөвшөөрдөг) хийгээд, хэрэглэгчийн анхны хүрэлт/дарлага дээр
     дууг нь асаана. */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    let unlocked = false;
    const events = ["pointerdown", "touchstart", "click", "keydown"] as const;

    const cleanup = () => {
      events.forEach((e) => {
        window.removeEventListener(e, unlock);
        document.removeEventListener(e, unlock);
      });
    };

    function unlock() {
      if (unlocked) return;
      const a = audioRef.current;
      if (!a) return;
      a.muted = false;
      a.volume = 1;
      a.play()
        .then(() => {
          unlocked = true;
          setIsPlaying(true);
          cleanup();
        })
        .catch(() => {
          /* дараагийн хүрэлт дээр дахин оролдоно */
        });
    }

    /* 1) Дуутай autoplay оролдох */
    audio.muted = false;
    audio
      .play()
      .then(() => {
        unlocked = true;
        setIsPlaying(true);
      })
      .catch(() => {
        /* 2) Хориглогдвол дуугүйгээр урьдчилан эхлүүлж unlock хүлээнэ */
        audio.muted = true;
        audio.play().catch(() => {});
        events.forEach((e) => {
          window.addEventListener(e, unlock, { passive: true });
          document.addEventListener(e, unlock, { passive: true });
        });
      });

    return cleanup;
  }, []);

  const toggleMusic = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.muted = false;
      audio.volume = 1;
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  }, [isPlaying]);

  const openGallery = useCallback((i: number) => {
    setActiveIndex(i);
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
    const h = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "Escape") closeGallery();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [showGallery, prevImage, nextImage, closeGallery]);

  useEffect(() => {
    document.body.style.overflow = showGallery ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showGallery]);

  useEffect(() => {
    if (!db) {
      setCommentStatus(
        "Firebase тохиргоо бүрэн биш байна. Comment хэсгийг ашиглахын тулд REACT_APP_FIREBASE_* env утгуудыг бөглөнө үү.",
      );
      return;
    }

    const commentsQuery = query(
      collection(db, COMMENTS_COLLECTION),
      orderBy("createdAt", "desc"),
      limit(6),
    );

    const unsubscribe = onSnapshot(
      commentsQuery,
      (snapshot) => {
        const nextComments = snapshot.docs.map(
          (doc: QueryDocumentSnapshot<DocumentData>) => {
            const data = doc.data();
            return {
              id: doc.id,
              name: String(data.name ?? "Зочин"),
              message: String(data.message ?? ""),
              guestCount: Number(data.guestCount ?? 0),
              createdAt: data.createdAt ?? null,
            };
          },
        );

        setComments(nextComments);
        setCommentStatus("");
      },
      (error) => {
        console.error("Firestore listener failed", error);
        setCommentStatus(
          error.code === "permission-denied"
            ? "Firestore rules comment уншихыг зөвшөөрөхгүй байна. Rules-ээ шалгаарай."
            : "Firebase-тай холбогдоход алдаа гарлаа. Консолийг шалгаарай.",
        );
      },
    );

    return unsubscribe;
  }, []);

  const submitComment = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!db) {
        setCommentStatus(
          "Firebase холбогдоогүй байна. Comment хадгалахын тулд env тохиргоо шаардлагатай.",
        );
        return;
      }

      const trimmedName = commentName.trim();
      const trimmedMessage = commentMessage.trim();
      const guestCount = 0;

      if (!trimmedName || !trimmedMessage) {
        setCommentStatus("Нэр, ирэх хүний тоо, сэтгэгдлээ бүрэн бөглөнө үү.");
        return;
      }

      setIsSubmittingComment(true);
      setCommentStatus("");

      try {
        await addDoc(collection(db, COMMENTS_COLLECTION), {
          name: trimmedName,
          guestCount,
          message: trimmedMessage,
          createdAt: new Date(),
        });

        setCommentName("");
        setCommentMessage("");
        setCommentStatus("Сэтгэгдэл амжилттай хадгалагдлаа.");
      } catch (error) {
        console.error("Failed to save comment", error);
        setCommentStatus("Хадгалах үед алдаа гарлаа. Дахин оролдоно уу.");
      } finally {
        setIsSubmittingComment(false);
      }
    },
    [commentMessage, commentName],
  );

  const renderCommentTime = useCallback(
    (createdAt?: Timestamp | Date | null) => {
      if (!createdAt) return "Шинэ";
      const date = createdAt instanceof Date ? createdAt : createdAt.toDate();
      return new Intl.DateTimeFormat("mn-MN", {
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    },
    [],
  );

  return (
    <div
      className="h-screen w-full flex justify-center items-center overflow-hidden font-elegant font-thin"
      style={{ background: "#E9DED3" }}
    >
      <div
        className="relative w-full max-w-[440px] h-full md:h-[94vh] overflow-hidden flex flex-col md:rounded-[34px] md:shadow-2xl"
        style={{ background: PALETTE.paper }}
      >
        <SakuraFalling />
        <audio ref={audioRef} src={musicSrc} loop preload="auto" />

        {/* ── Lightbox ── */}
        <AnimatePresence>
          {showGallery && (
            <motion.div
              key="modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0 z-50 flex flex-col items-center justify-center"
              style={{ background: "rgba(30,22,20,0.94)" }}
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
              <p className="absolute top-6 left-0 right-0 text-center text-white/50 text-sm tracking-widest">
                {activeIndex + 1} / {GALLERY_IMAGES.length}
              </p>
              <motion.img
                key={activeIndex}
                src={GALLERY_IMAGES[activeIndex]}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25 }}
                className="max-h-[76vh] max-w-[92%] rounded-xl object-contain shadow-2xl"
                onClick={(e) => e.stopPropagation()}
                alt="Дурсамж"
                loading="eager"
              />
              <button
                type="button"
                aria-label="Өмнөх"
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute inset-y-0 left-0 w-1/4 flex items-center pl-3 text-white/60 text-5xl"
              >
                ‹
              </button>
              <button
                type="button"
                aria-label="Дараах"
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute inset-y-0 right-0 w-1/4 flex items-center justify-end pr-3 text-white/60 text-5xl"
              >
                ›
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Scroll хэсэг ── */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto no-scrollbar scroll-smooth"
        >
          {/* COVER */}
          <div className="relative w-full h-[100svh] min-h-[600px] max-h-[880px] overflow-hidden">
            <motion.img
              src={covers}
              alt="Хуримын зураг"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ filter: "saturate(0.82) brightness(0.96)" }}
              initial={{ scale: 1.08, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.6, ease: "easeOut" }}
              loading="eager"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(70,52,45,.28) 0%, rgba(70,52,45,0) 26%, rgba(70,52,45,0) 52%, rgba(251,247,242,.30) 82%, rgba(251,247,242,.97) 100%)",
              }}
            />
            <div className="absolute inset-0 z-[7] flex flex-col items-center justify-between text-center px-6 pt-16 pb-12">
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 1 }}
                style={{
                  fontFamily: FONT.accent,
                  letterSpacing: "0.42em",
                  textTransform: "uppercase",
                  fontSize: 12.5,
                  color: "#F6EEE7",
                  textShadow: "0 1px 12px rgba(60,40,35,.45)",
                }}
              >
                The Wedding of
              </motion.p>

              <div className="flex flex-col items-center">
                <motion.h1
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55, duration: 1.1 }}
                  style={{
                    fontFamily: FONT.display,
                    color: "#FCF7F2",
                    lineHeight: 1.06,
                    fontSize: 46,
                    fontStyle: "italic",
                    textShadow: "0 2px 24px rgba(55,35,30,.5)",
                  }}
                >
                  {CONFIG.groom}
                  <span
                    style={{
                      fontFamily: FONT.accent,
                      fontStyle: "italic",
                      fontSize: 34,
                      color: PALETTE.blush,
                      display: "block",
                      margin: "2px 0",
                    }}
                  >
                    &amp;
                  </span>
                  {CONFIG.bride}
                </motion.h1>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1, duration: 1 }}
                  className="mt-4"
                >
                  <p
                    style={{
                      fontFamily: FONT.accent,
                      letterSpacing: "0.34em",
                      fontSize: 16,
                      color: "#F7EFE8",
                      textShadow: "0 1px 14px rgba(60,40,35,.5)",
                    }}
                  >
                    {CONFIG.dateLabel}
                  </p>
                  <p
                    className="mt-1.5"
                    style={{
                      fontWeight: 300,
                      letterSpacing: "0.28em",
                      fontSize: 11,
                      textTransform: "uppercase",
                      color: "#F7EFE8",
                      textShadow: "0 1px 14px rgba(60,40,35,.5)",
                    }}
                  >
                    {CONFIG.dayLabel}
                  </p>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4, duration: 1 }}
                className="flex flex-col items-center gap-2"
                style={{ color: "#F3E9E1" }}
              >
                <span
                  style={{
                    fontFamily: FONT.accent,
                    fontStyle: "italic",
                    fontSize: 13,
                    letterSpacing: "0.12em",
                  }}
                >
                  урьж байна
                </span>
                <span
                  className="block"
                  style={{
                    width: 16,
                    height: 16,
                    borderRight: "1.4px solid #F3E9E1",
                    borderBottom: "1.4px solid #F3E9E1",
                    transform: "rotate(45deg)",
                    animation: "wedbob 2.4s ease-in-out infinite",
                  }}
                />
              </motion.div>
            </div>
          </div>

          {/* GREETING */}
          <section style={{ background: PALETTE.paper }}>
            <Reveal root={scrollRef}>
              <Divider />
            </Reveal>
            <div className="px-8">
              <Reveal root={scrollRef}>
                <Eyebrow>Greeting</Eyebrow>
              </Reveal>
              <Reveal root={scrollRef} delay={0.08}>
                <p
                  className="text-center mt-4"
                  style={{
                    fontFamily: FONT.accent,
                    fontStyle: "italic",
                    fontSize: 19,
                    color: PALETTE.roseDeep,
                    lineHeight: 1.6,
                  }}
                >
                  Хоёр зүрх нэгдэн,
                  <br />
                  нэг гэр бүл болох энэ өдөр
                </p>
              </Reveal>
            </div>
            <div className="px-8 mt-6">
              <Reveal root={scrollRef} delay={0.12}>
                <p
                  className="text-center"
                  style={{
                    fontWeight: 300,
                    fontSize: 14.5,
                    lineHeight: 2.05,
                    color: PALETTE.ink,
                  }}
                >
                  Итгэлээр түшиглэн, хайраар холбогдсон бид хоёрын амьдралын
                  хамгийн нандин энэ мөчид эрхэм таныг хүндэтгэлтэйгээр урьж
                  байна. Бие биеэ энэрэн хайрлаж, аз жаргалаар дүүрэн амьдралыг
                  хамтдаа бүтээх бидний ирээдүйг таны халуун ерөөл гэрэлтүүлэх
                  болно.
                </p>
              </Reveal>
            </div>

            <Reveal root={scrollRef}>
              <Divider small />
            </Reveal>

            {/* Roles */}
            <div className="px-8 flex flex-col gap-6 pb-2">
              <Reveal root={scrollRef}>
                <div className="flex flex-col items-center gap-1 text-center">
                  <span
                    style={{
                      fontWeight: 300,
                      fontSize: 12,
                      color: PALETTE.muted,
                    }}
                  >
                    Мөнхбаатар · Ариунтуяа нарын хүү
                  </span>
                  <span
                    style={{
                      fontFamily: FONT.accent,
                      fontStyle: "italic",
                      fontSize: 14,
                      color: PALETTE.rose,
                    }}
                  >
                    Сүйт залуу
                  </span>
                  <span
                    style={{
                      fontFamily: FONT.display,
                      fontSize: 23,
                      color: PALETTE.mauve,
                      fontStyle: "italic",
                    }}
                  >
                    {CONFIG.groom}
                  </span>
                </div>
              </Reveal>
              <Reveal root={scrollRef}>
                <p
                  className="text-center"
                  style={{ color: PALETTE.blush, fontSize: 15 }}
                >
                  ♥
                </p>
              </Reveal>
              <Reveal root={scrollRef}>
                <div className="flex flex-col items-center gap-1 text-center">
                  <span
                    style={{
                      fontWeight: 300,
                      fontSize: 12,
                      color: PALETTE.muted,
                    }}
                  >
                    Батбаяр · Болормаа нарын охин
                  </span>
                  <span
                    style={{
                      fontFamily: FONT.accent,
                      fontStyle: "italic",
                      fontSize: 14,
                      color: PALETTE.rose,
                    }}
                  >
                    Сүйт бүсгүй
                  </span>
                  <span
                    style={{
                      fontFamily: FONT.display,
                      fontSize: 23,
                      color: PALETTE.mauve,

                      fontStyle: "italic",
                    }}
                  >
                    {CONFIG.bride}
                  </span>
                </div>
              </Reveal>
            </div>
          </section>

          {/* GALLERY */}
          <section
            style={{
              background: PALETTE.paper,
              paddingTop: 20,
              fontStyle: "italic",
            }}
          >
            <Reveal root={scrollRef}>
              <Divider small />
            </Reveal>
            <Reveal root={scrollRef}>
              <Eyebrow>Our Moments</Eyebrow>
            </Reveal>

            <div className="grid grid-cols-3 gap-1 px-4 mt-6">
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
                  <img
                    src={img}
                    alt="Дурсамж"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </motion.button>
              ))}
            </div>

            <div className="flex justify-center mt-5">
              <motion.button
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={() => openGallery(0)}
                style={{
                  fontFamily: FONT.accent,
                  fontStyle: "italic",
                  fontSize: 15,
                  letterSpacing: "0.06em",
                  color: PALETTE.roseDeep,
                  border: `1px solid ${PALETTE.line}`,
                  borderRadius: 999,
                  padding: "9px 26px",
                }}
              >
                Бүх зургийг үзэх ✦
              </motion.button>
            </div>
            <Divider small />
          </section>

          {/* CALENDAR + COUNTDOWN */}
          <WeddingCalendar />

          {/* LOCATION */}
          <section style={{ background: PALETTE.paper, padding: "52px 0" }}>
            <Reveal root={scrollRef}>
              <Eyebrow>Location</Eyebrow>
            </Reveal>

            <div
              className="mx-6 mt-6 overflow-hidden rounded-2xl"
              style={{
                border: `1px solid ${PALETTE.line}`,
                boxShadow: "0 18px 40px -28px rgba(110,90,80,.6)",
              }}
            >
              <iframe
                title="Байршил"
                className="w-full block"
                style={{ height: 250, border: 0, filter: "saturate(0.9)" }}
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d10695.247020883977!2d106.95975198065267!3d47.920679739523756!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5d96911c8ad90ded%3A0x154015dc33d0e30a!2z0KPQu9Cw0LDQvdCx0LDQsNGC0LDRgCDQsdCw0L_RgtC40YHRgiDQt9Kv0q_QvSDRh9GD0YPQu9Cz0LDQvQ!5e0!3m2!1sen!2smn!4v1698212444861!5m2!1sen!2smn"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <Reveal root={scrollRef}>
              <div className="text-center mt-6">
                <h4
                  style={{
                    fontFamily: FONT.display,
                    fontSize: 20,
                    color: PALETTE.mauve,
                  }}
                >
                  {CONFIG.venueTitle}
                </h4>
                <p
                  className="mt-1.5"
                  style={{
                    fontWeight: 300,
                    fontSize: 13,
                    color: PALETTE.muted,
                  }}
                >
                  {CONFIG.venueSub}
                </p>
                <a
                  href="https://maps.app.goo.gl/qqNbTqaeKwDg13iS8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4"
                  style={{
                    fontFamily: FONT.accent,
                    fontStyle: "italic",
                    fontSize: 14,
                    color: PALETTE.roseDeep,
                    borderBottom: `1px solid ${PALETTE.blush}`,
                    paddingBottom: 2,
                    textDecoration: "none",
                  }}
                >
                  Газрын зураг дээр нээх →
                </a>
              </div>
            </Reveal>
          </section>

          {/* CONTACT */}
          <CoupleContact />

          {/* GIFT */}
          <section
            style={{ background: PALETTE.paper, padding: "40px 0 10px" }}
          >
            <Reveal root={scrollRef}>
              <Eyebrow>With Heart</Eyebrow>
            </Reveal>

            <div className="mx-6 mt-5">
              {/* <button
                type="button"
                onClick={() => setGiftOpen((v) => !v)}
                className="w-full transition-transform active:scale-[0.99]"
                style={{
                  background: PALETTE.greige,
                  border: `1px solid ${PALETTE.line}`,
                  borderRadius: 14,
                  padding: 16,
                  fontFamily: FONT.accent,
                  fontStyle: "italic",
                  fontSize: 16,
                  color: PALETTE.roseDeep,
                }}
              ></button> */}
              <div
                style={{
                  overflow: "hidden",
                  transition: "max-height .55s ease",
                }}
              >
                {[
                  {
                    who: "Сүйт залуу · " + CONFIG.groom,
                    no: "1235121875",
                    bank: "Голомт банк",
                  },
                  {
                    who: "Сүйт бүсгүй · " + CONFIG.bride,
                    no: "4xxx xxxx",
                    bank: "Голомт банк",
                  },
                ].map((a, i) => (
                  <div
                    key={i}
                    className="mt-3 bg-white"
                    style={{
                      border: `1px solid ${PALETTE.line}`,
                      borderRadius: 12,
                      padding: "18px",
                    }}
                  >
                    <p
                      style={{
                        fontSize: 12,
                        color: PALETTE.muted,
                        letterSpacing: "0.06em",
                      }}
                    >
                      {a.who}
                    </p>
                    <div className="flex items-center justify-between mt-2 gap-3">
                      <div>
                        <p
                          style={{
                            fontFamily: FONT.display,
                            fontSize: 17,
                            color: PALETTE.mauve,
                            letterSpacing: "0.03em",
                          }}
                        >
                          {a.no}
                        </p>
                        <p
                          style={{
                            fontWeight: 300,
                            fontSize: 11.5,
                            color: PALETTE.muted,
                            marginTop: 2,
                          }}
                        >
                          {a.bank}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          navigator.clipboard?.writeText(
                            a.no.replace(/\s/g, ""),
                          )
                        }
                        style={{
                          fontSize: 11,
                          letterSpacing: "0.08em",
                          color: PALETTE.roseDeep,
                          background: PALETTE.greige,
                          border: `1px solid ${PALETTE.line}`,
                          borderRadius: 999,
                          padding: "7px 14px",
                        }}
                      >
                        Хуулах
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* COMMENTS */}
          <section style={{ background: PALETTE.paper, padding: "8px 0 44px" }}>
            <Reveal root={scrollRef}>
              <Eyebrow>Guestbook</Eyebrow>
            </Reveal>

            <Reveal root={scrollRef} delay={0.05}>
              <div
                className="mx-6 mt-5 rounded-3xl border bg-white/85 p-5 shadow-[0_16px_34px_-28px_rgba(110,90,80,.55)] backdrop-blur-sm"
                style={{ borderColor: PALETTE.line }}
              >
                <p
                  className="text-center"
                  style={{
                    fontFamily: FONT.accent,
                    fontStyle: "italic",
                    fontSize: 18,
                    color: PALETTE.roseDeep,
                    lineHeight: 1.6,
                  }}
                >
                  Сайхан ерөөл, мэндчилгээгээ үлдээгээрэй.
                </p>

                <form
                  className="mt-5 flex flex-col gap-3"
                  onSubmit={submitComment}
                >
                  <input
                    value={commentName}
                    onChange={(event) => setCommentName(event.target.value)}
                    placeholder="Таны нэр"
                    className="w-full rounded-2xl border bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-transparent focus:ring-2"
                    style={{
                      borderColor: PALETTE.line,
                      color: PALETTE.ink,
                    }}
                  />

                  <textarea
                    value={commentMessage}
                    onChange={(event) => setCommentMessage(event.target.value)}
                    placeholder="Хүндэтгэлийн үг, ерөөлөө энд бичнэ үү"
                    rows={4}
                    className="w-full rounded-2xl border bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-transparent focus:ring-2"
                    style={{ borderColor: PALETTE.line, color: PALETTE.ink }}
                  />

                  <button
                    type="submit"
                    disabled={isSubmittingComment}
                    className="rounded-full px-5 py-3 text-sm transition-transform active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                    style={{
                      background: PALETTE.roseDeep,
                      color: "#fff7f2",
                      fontFamily: FONT.accent,
                      letterSpacing: "0.08em",
                    }}
                  >
                    {isSubmittingComment
                      ? "Хадгалж байна..."
                      : "Сэтгэгдэл илгээх"}
                  </button>
                </form>

                <p
                  className="mt-3 text-center text-xs"
                  style={{ color: PALETTE.muted, minHeight: 18 }}
                >
                  {commentStatus ||
                    (isFirebaseConfigured
                      ? ""
                      : "Firebase тохиргоо бүрэн биш байна.")}
                </p>
              </div>
            </Reveal>

            <div className="mx-6 mt-6 grid gap-3">
              {comments.length > 0 ? (
                comments.map((comment, index) => (
                  <Reveal
                    root={scrollRef}
                    key={comment.id}
                    delay={Math.min(index * 0.05, 0.18)}
                  >
                    <div
                      className="rounded-2xl border bg-white px-4 py-4 shadow-[0_12px_24px_-24px_rgba(110,90,80,.5)]"
                      style={{ borderColor: PALETTE.line }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p
                            style={{
                              fontFamily: FONT.display,
                              fontSize: 18,
                              color: PALETTE.mauve,
                            }}
                          >
                            {comment.name}
                          </p>
                        </div>
                        <span
                          className="text-[11px]"
                          style={{ color: PALETTE.rose }}
                        >
                          {renderCommentTime(comment.createdAt)}
                        </span>
                      </div>
                      <p
                        className="mt-3 text-sm leading-7"
                        style={{ color: PALETTE.ink }}
                      >
                        {comment.message}
                      </p>
                    </div>
                  </Reveal>
                ))
              ) : (
                <Reveal root={scrollRef}>
                  <div
                    className="mx-0 rounded-2xl border border-dashed bg-transparent px-4 py-6 text-center"
                    style={{ borderColor: PALETTE.line }}
                  >
                    <p style={{ color: PALETTE.muted, fontSize: 13 }}>
                      Одоогоор сэтгэгдэл алга байна. Эхний мэндчилгээг та
                      үлдээгээрэй.
                    </p>
                  </div>
                </Reveal>
              )}
            </div>
          </section>

          {/* CLOSING */}

          <Reveal root={scrollRef} className="mt-10 mb-2 text-center">
            <img
              src={dans}
              alt="Талархал"
              className="w-full mt-4"
              loading="lazy"
              decoding="async"
            />
          </Reveal>
          <section
            className="relative text-center"
            style={{ padding: "60px 30px 90px", background: PALETTE.paper }}
          >
            <Reveal root={scrollRef}>
              <p
                className="italic"
                style={{
                  fontFamily: FONT.display,
                  fontSize: 26,
                  color: PALETTE.mauve,
                }}
              >
                {CONFIG.groom} &amp; {CONFIG.bride}
              </p>
              <p
                className="mt-4"
                style={{
                  fontFamily: FONT.accent,
                  letterSpacing: "0.4em",
                  textTransform: "uppercase",
                  fontSize: 12,
                  color: PALETTE.rose,
                }}
              >
                Thank you
              </p>
              <p
                className="mt-3"
                style={{ color: PALETTE.blush, fontSize: 20 }}
              >
                ♥
              </p>
              <p
                className="mt-10"
                style={{
                  fontWeight: 300,
                  fontSize: 11,
                  color: PALETTE.muted,
                  letterSpacing: "0.06em",
                }}
              >
                {CONFIG.dateLabel} — Улаанбаатар
              </p>
            </Reveal>
          </section>
        </div>

        {/* Music button */}
        <button
          type="button"
          onClick={toggleMusic}
          aria-label={isPlaying ? "Хөгжим зогсоох" : "Хөгжим тоглуулах"}
          className="absolute bottom-6 right-6 z-40 w-11 h-11 rounded-full flex items-center justify-center transition-transform active:scale-90"
          style={{
            background: "rgba(255,255,255,0.86)",
            backdropFilter: "blur(6px)",
            border: `1px solid ${PALETTE.blush}`,
            boxShadow: "0 10px 26px -10px rgba(150,110,95,.7)",
          }}
        >
          <span className="flex gap-[2px] items-end h-4">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  width: 2.5,
                  background: PALETTE.rose,
                  borderRadius: 2,
                  height: 6,
                  animation: isPlaying
                    ? `wedeq 1s ease-in-out ${i * 0.2}s infinite`
                    : "none",
                }}
              />
            ))}
          </span>
        </button>
      </div>

      {/* Keyframes (Tailwind config-гүйгээр) */}
      <style>{`
        @keyframes wedbob {0%,100%{transform:translateY(0) rotate(45deg);opacity:.55}50%{transform:translateY(6px) rotate(45deg);opacity:1}}
        @keyframes wedeq {0%,100%{height:5px}50%{height:15px}}
        .no-scrollbar::-webkit-scrollbar{display:none}
        .no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}
        @media (prefers-reduced-motion: reduce){*{animation:none !important}}
      `}</style>
    </div>
  );
}
