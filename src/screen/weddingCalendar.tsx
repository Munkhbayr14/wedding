import { useEffect, useState } from "react";

/* Хуримын огноо — энд өөрчилнө */
const WEDDING = new Date(2026, 8, 12, 10, 30, 0); // 2026-09-12 10:30 (сар 0-indexed: 8 = 9-р сар)

const P = {
  paper: "#FBF7F2",
  greige: "#F1E9E0",
  blush: "#E7CFC7",
  rose: "#C08A7D",
  roseDeep: "#A9705F",
  mauve: "#6E5A52",
  ink: "#514842",
  muted: "#9A8B81",
  line: "#E4D8CD",
};
/* Хуучин font-elegant-ийг section-оос өвлүүлнэ */
const F = {
  display: "inherit",
  accent: "inherit",
  body: "inherit",
};

function useCountdown(target: Date) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target.getTime() - now);
  return {
    d: Math.floor(diff / 86400000),
    h: Math.floor((diff % 86400000) / 3600000),
    m: Math.floor((diff % 3600000) / 60000),
    s: Math.floor((diff % 60000) / 1000),
  };
}

export default function WeddingCalendar() {
  const { d, h, m, s } = useCountdown(WEDDING);

  const year = WEDDING.getFullYear();
  const month = WEDDING.getMonth();
  const weddingDay = WEDDING.getDate();
  const first = new Date(year, month, 1).getDay();
  const dim = new Date(year, month + 1, 0).getDate();
  const head = ["S", "M", "T", "W", "T", "F", "S"];

  const cells: (number | null)[] = [
    ...Array(first).fill(null),
    ...Array.from({ length: dim }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const monthName = WEDDING.toLocaleString("en-US", { month: "long" });
  const units: [string, number][] = [
    ["Days", d],
    ["Hrs", h],
    ["Min", m],
    ["Sec", s],
  ];

  return (
    <section
      className="font-elegant font-thin"
      style={{ background: P.greige, padding: "52px 0" }}
    >
      <p
        className="text-center"
        style={{
          fontFamily: F.accent,
          letterSpacing: "0.34em",
          textTransform: "uppercase",
          fontSize: 13,
          color: P.rose,
        }}
      >
        {monthName}&nbsp;{year}
      </p>
      <p
        className="text-center"
        style={{
          fontFamily: F.display,
          fontSize: 40,
          color: P.mauve,
          marginTop: 4,
        }}
      >
        {weddingDay}
      </p>
      <p
        className="text-center"
        style={{
          fontWeight: 300,
          fontSize: 11.5,
          letterSpacing: "0.26em",
          color: P.muted,
          textTransform: "uppercase",
          marginTop: 6,
        }}
      >
        Saturday · 10:30 AM
      </p>

      <div className="px-8 mt-6">
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {head.map((hd, i) => (
                <th
                  key={i}
                  style={{
                    fontWeight: 400,
                    fontSize: 11,
                    padding: "8px 0",
                    letterSpacing: "0.05em",
                    color:
                      i === 0 ? "#c98a86" : i === 6 ? "#8ea2b4" : P.muted,
                  }}
                >
                  {hd}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: cells.length / 7 }, (_, r) => (
              <tr key={r}>
                {cells.slice(r * 7, r * 7 + 7).map((day, c) => {
                  const isWed = day === weddingDay;
                  const color = isWed
                    ? "#fff"
                    : c === 0
                      ? "#c98a86"
                      : c === 6
                        ? "#8ea2b4"
                        : P.ink;
                  return (
                    <td
                      key={c}
                      style={{
                        textAlign: "center",
                        height: 40,
                        position: "relative",
                        fontWeight: isWed ? 500 : 300,
                        fontSize: 14,
                        color,
                      }}
                    >
                      {isWed && (
                        <span
                          style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            width: 34,
                            height: 34,
                            borderRadius: "50%",
                            transform: "translate(-50%,-50%)",
                            background: P.rose,
                            boxShadow: "0 6px 16px -6px rgba(160,110,95,.8)",
                            zIndex: 1,
                          }}
                        />
                      )}
                      <span style={{ position: "relative", zIndex: 2 }}>
                        {day ?? ""}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Countdown */}
      <div className="flex justify-center gap-2.5 mt-7">
        {units.map(([label, val], i) => (
          <div key={label} className="flex items-start gap-2.5">
            <div
              className="flex flex-col items-center"
              style={{ minWidth: 52 }}
            >
              <span
                style={{
                  fontFamily: F.display,
                  fontSize: 26,
                  color: P.mauve,
                  lineHeight: 1,
                }}
              >
                {String(val).padStart(2, "0")}
              </span>
              <span
                style={{
                  fontWeight: 300,
                  fontSize: 9.5,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: P.muted,
                  marginTop: 8,
                }}
              >
                {label}
              </span>
            </div>
            {i < units.length - 1 && (
              <span
                style={{
                  fontFamily: F.display,
                  fontSize: 20,
                  color: P.line,
                  marginTop: 2,
                }}
              >
                :
              </span>
            )}
          </div>
        ))}
      </div>

      <p
        className="text-center mt-6"
        style={{
          fontFamily: F.accent,
          fontStyle: "italic",
          fontSize: 15,
          color: P.roseDeep,
        }}
      >
        Хуримын өдрийг хүртэл{" "}
        <b
          style={{
            fontStyle: "normal",
            fontFamily: F.display,
            color: P.rose,
          }}
        >
          D-{d}
        </b>{" "}
        хоног
      </p>
    </section>
  );
}
