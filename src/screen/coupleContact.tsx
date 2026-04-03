import groomPhoto from "../barsaa/b-7.jpg";
import bridePhoto from "../barsaa/b-8.jpg";

interface Person {
  role: string;
  name: string;
  phone: string;
  photo: string;
}

interface ContactCardProps {
  person: Person;
  label: string;
}

function ContactCard({ person }: ContactCardProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="w-full aspect-[3/4] overflow-hidden rounded-sm">
        <img
          src={person.photo}
          alt={person.name}
          className="w-full h-full object-cover object-top"
          loading="lazy"
        />
      </div>

      <p className="font-elegant font-thin text-[15px] text-gray-700">
        <span className="">♥</span>{" "}
        <span className="text-gray-400 text-[13px]">{person.role}</span>{" "}
        <span className="font-elegant font-thin">{person.name}</span>
      </p>

      <div className="flex gap-3">
        <a
          href={`tel:${person.phone}`}
          className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-[#e7b596] hover:text-white transition-colors"
          aria-label={`${person.name}-д залгах`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 5.75A2.75 2.75 0 015.75 3h.992c.456 0 .864.272 1.05.698l1.2 2.8a1.25 1.25 0 01-.287 1.4l-.9.9a12.042 12.042 0 005.597 5.597l.9-.9a1.25 1.25 0 011.4-.287l2.8 1.2c.426.186.698.594.698 1.05v.992A2.75 2.75 0 0118.25 21C9.828 21 3 14.172 3 5.75z"
            />
          </svg>
        </a>
        <a
          href={`sms:${person.phone}`}
          className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-[#e7b596] hover:text-white transition-colors"
          aria-label={`${person.name}-д мессеж илгээх`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
            />
          </svg>
        </a>
      </div>
    </div>
  );
}

export default function CoupleContact() {
  const groom: Person = {
    role: "сүйт залуу",
    name: "Барсбаатар",
    phone: "99001234",
    photo: groomPhoto,
  };

  const bride: Person = {
    role: "сүйт бүсгүй",
    name: "Одончимэг",
    phone: "88001234",
    photo: bridePhoto,
  };

  return (
    <div className="bg-white w-full px-4 py-8">
      <div className="grid grid-cols-2 gap-4">
        <ContactCard person={groom} label="신랑측 혼주" />
        <ContactCard person={bride} label="신부측 혼주" />
      </div>
      <hr className="mt-8 border-dashed" />
    </div>
  );
}
