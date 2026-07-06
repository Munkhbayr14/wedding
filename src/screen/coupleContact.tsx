import groomPhoto from "../barsaa/b-7.jpg";
import bridePhoto from "../barsaa/b-8.jpg";

const P = {
  paper: "#FBF7F2",
  greige: "#F1E9E0",
  blush: "#E7CFC7",
  rose: "#C08A7D",
  roseDeep: "#A9705F",
  mauve: "#6E5A52",
  muted: "#9A8B81",
  line: "#E4D8CD",
};
/* Хуучин font-elegant-ийг section-оос өвлүүлнэ */
const F = {
  display: "inherit",
  accent: "inherit",
  body: "inherit",
};

interface Person {
  role: string;
  name: string;
  phone: string;
  photo: string;
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} width="17" height="17">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 5.75A2.75 2.75 0 015.75 3h.992c.456 0 .864.272 1.05.698l1.2 2.8a1.25 1.25 0 01-.287 1.4l-.9.9a12.042 12.042 0 005.597 5.597l.9-.9a1.25 1.25 0 011.4-.287l2.8 1.2c.426.186.698.594.698 1.05v.992A2.75 2.75 0 0118.25 21C9.828 21 3 14.172 3 5.75z"
      />
    </svg>
  );
}
function SmsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} width="17" height="17">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0l-8.32 5.12a2.25 2.25 0 01-2.36 0L3.32 8.91"
      />
    </svg>
  );
}

function ContactCard({ person }: { person: Person }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="w-full overflow-hidden"
        style={{
          aspectRatio: "1 / 1",
          borderRadius: 4,
          background: "linear-gradient(135deg,#efdfd7,#e3cfc6)",
        }}
      >
        <img
          src={person.photo}
          alt={person.name}
          className="w-full h-full object-cover object-top"
          style={{ filter: "saturate(0.85)" }}
          loading="lazy"
        />
      </div>

      <span
        style={{
          fontFamily: F.accent,
          fontStyle: "italic",
          fontSize: 13,
          color: P.rose,
        }}
      >
        {person.role}
      </span>
      <span
        style={{
          fontFamily: F.display,
          fontSize: 19,
          color: P.mauve,
          marginTop: -6,
        }}
      >
        {person.name}
      </span>

      <div className="flex gap-2.5 mt-0.5">
        <a
          href={`tel:${person.phone}`}
          aria-label={`${person.name}-д залгах`}
          className="flex items-center justify-center transition-transform active:scale-90"
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: P.greige,
            color: P.roseDeep,
            border: `1px solid ${P.line}`,
          }}
        >
          <PhoneIcon />
        </a>
        <a
          href={`sms:${person.phone}`}
          aria-label={`${person.name}-д мессеж илгээх`}
          className="flex items-center justify-center transition-transform active:scale-90"
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: P.greige,
            color: P.roseDeep,
            border: `1px solid ${P.line}`,
          }}
        >
          <SmsIcon />
        </a>
      </div>
    </div>
  );
}

export default function CoupleContact() {
  const groom: Person = {
    role: "Сүйт залуу",
    name: "Барсбаатар",
    phone: "99001234",
    photo: groomPhoto,
  };
  const bride: Person = {
    role: "Сүйт бүсгүй",
    name: "Одончимэг",
    phone: "88001234",
    photo: bridePhoto,
  };

  return (
    <section
      className="font-elegant font-thin"
      style={{ background: P.greige, padding: "52px 0" }}
    >
      <p
        className="text-center"
        style={{
          fontFamily: F.accent,
          letterSpacing: "0.4em",
          textTransform: "uppercase",
          fontSize: 12,
          color: P.rose,
          fontWeight: 500,
        }}
      >
        Contact
      </p>
      <p
        className="text-center"
        style={{
          fontFamily: F.display,
          fontSize: 25,
          color: P.mauve,
          marginTop: 12,
          marginBottom: 24,
        }}
      >
        Холбоо барих
      </p>

      <div className="grid grid-cols-2 gap-4 px-7">
        <ContactCard person={groom} />
        <ContactCard person={bride} />
      </div>
    </section>
  );
}
