export default function WeddingCalendar() {
  const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  const startDay = 2;
  const totalDays = 30;
  const weddingDay = 12;

  const cells: (number | null)[] = [
    ...Array(startDay).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ];

  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="bg-white w-full px-6  font-elegant font-thin ">
      <div className="flex justify-center items-baseline gap-2 ">
        <span className="text-[52px] font-elegant font-thin  tracking-tight text-gray-800">
          09
        </span>
        <span className="text-[28px] text-gray-400 font-elegant font-thin ">
          /
        </span>
        <span className="text-[52px] font-elegant font-thin  tracking-tight text-gray-800">
          12
        </span>
      </div>

      {/* SAT. AM 11:30 */}
      <p className="text-center text-[13px] font-elegant font-thin  tracking-widest text-gray-400 mb-6">
        SAT. AM 10:30
      </p>

      <hr className="border-gray-200 mb-4" />

      <div className="grid grid-cols-7 mb-2">
        {days.map((d, i) => (
          <div
            key={d}
            className={`text-center text-[13px] py-1 ${
              i === 0
                ? "text-red-300"
                : i === 6
                  ? "text-blue-300"
                  : "text-gray-400"
            }`}
          >
            {d}
          </div>
        ))}
      </div>

      <hr className="border-gray-100 mb-2" />

      <div className="grid font-elegant font-thin  grid-cols-7">
        {cells.map((day, idx) => {
          const col = idx % 7;
          const isWedding = day === weddingDay;
          const isSun = col === 0;
          const isSat = col === 6;

          return (
            <div
              key={idx}
              className="relative flex font-elegant font-thin  justify-center items-center py-3"
            >
              {day ? (
                <>
                  {isWedding && (
                    <div className="absolute w-9 h-9 rounded-full bg-[#f1c3b4]" />
                  )}
                  <span
                    className={`relative text-[15px] z-10 ${
                      isWedding
                        ? "text-white font-medium"
                        : isSun
                          ? "text-red-300"
                          : isSat
                            ? "text-blue-300"
                            : "text-gray-700"
                    }`}
                  >
                    {day}
                  </span>
                </>
              ) : null}
            </div>
          );
        })}
      </div>
      <hr className="border-gray-200 mb-4" />
    </div>
  );
}
