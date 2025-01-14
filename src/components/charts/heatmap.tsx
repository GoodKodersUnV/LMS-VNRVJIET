import React, { useState } from "react";
import {
  format,
  startOfToday,
  startOfYear,
  endOfYear,
  eachDayOfInterval,
  getDay,
  isSameDay,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarHeatmapProps {
  classes: string[]; // dates when classes were held
  data: string[]; // dates when student was present
}

const CalendarHeatmap: React.FC<CalendarHeatmapProps> = ({ classes, data }) => {
  const [currentYear, setCurrentYear] = useState(startOfToday().getFullYear());
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

  const generateDatesForYear = (year: number) => {
    const startOfYearDate = startOfYear(new Date(year, 0, 1));
    const endOfYearDate = endOfYear(new Date(year, 0, 1));
    const allDays = eachDayOfInterval({
      start: startOfYearDate,
      end: endOfYearDate,
    }).map((date) => {
      const dateStr = format(date, "yyyy-MM-dd");
      return {
        date,
        isPresent: data.includes(dateStr),
        isInClass: classes.includes(dateStr),
      };
    });

    const paddingDays = getDay(startOfYearDate);
    const paddedDays = Array.from({ length: paddingDays }, () => null).concat(
      allDays,
    );

    return paddedDays;
  };

  const days = generateDatesForYear(currentYear);

  const handlePreviousYear = () => setCurrentYear(currentYear - 1);
  const handleNextYear = () => setCurrentYear(currentYear + 1);

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const getCellColor = (isPresent: boolean, isInClass: boolean) => {
    if (!isInClass) return "bg-gray-200";
    return isPresent ? "bg-green-500" : "bg-red-500";
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="text-xl font-semibold text-gray-700">{currentYear}</div>

      <div className="relative w-full max-w-5xl">
        <div className="mb-2 ms-16 grid grid-cols-12 gap-1">
          {months.map((month) => (
            <div key={month} className="text-xs font-medium text-gray-500">
              {month}
            </div>
          ))}
        </div>

        <div className="grid grid-flow-col grid-rows-7 gap-1">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="w-14 text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}

          {days.map((dateInfo, index) => {
            if (!dateInfo) {
              return <div key={`empty-${index}`} className="h-4 w-4" />;
            }

            const { date, isPresent, isInClass } = dateInfo;
            const cellColor = getCellColor(isPresent, isInClass);

            return (
              <div
                key={format(date, "yyyy-MM-dd")}
                className={`relative h-4 w-4 cursor-pointer rounded ${cellColor} transition-all duration-200 hover:scale-110`}
                onMouseEnter={() => setHoveredDate(date)}
                onMouseLeave={() => setHoveredDate(null)}
              >
                {hoveredDate && isSameDay(hoveredDate, date) && (
                  <div className="absolute -left-20 -top-8 z-50 rounded bg-gray-900 px-2 py-1 text-xs text-white">
                    <div>{format(date, "MMM dd, yyyy")}</div>
                    <div>
                      {isInClass
                        ? isPresent
                          ? "Present"
                          : "Absent"
                        : "No Class"}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handlePreviousYear}
          className="rounded-full p-2 text-gray-600 hover:bg-gray-100"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={handleNextYear}
          className="rounded-full p-2 text-gray-600 hover:bg-gray-100"
          disabled={currentYear === startOfToday().getFullYear()}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default CalendarHeatmap;
