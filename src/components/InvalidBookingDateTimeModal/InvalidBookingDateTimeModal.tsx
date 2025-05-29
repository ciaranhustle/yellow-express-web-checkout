import { isInsideOpenHours } from "@/lib/utils";
import { X } from "lucide-react";

interface InvalidBookingDateTimeModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  appSettings: AppSettings;
}

const formatTimeToString = (time: string) => {
  if (!time) return "";

  const parts = time.split(":");
  let suffix = "am";
  let hour = Number(parts[0]);
  if (hour === 0) {
    hour = 12;
  } else if (hour >= 12) {
    suffix = "pm";
    if (hour > 12) {
      hour -= 12;
    }
  }
  const minute = Number(parts[1]);

  return `${hour}${minute > 0 ? `:${minute}${suffix}` : suffix}`;
};

export const InvalidBookingDateTimeModal: React.FC<
  InvalidBookingDateTimeModalProps
> = ({ isOpen, setIsOpen, appSettings }) => {
  if (!isOpen) return null;

  const getActiveHoursString = () => {
    let result = `${formatTimeToString(
      appSettings?.times.weekDay.earliest
    )} - ${formatTimeToString(
      appSettings?.times.weekDay.latest
    )} Monday to Friday, ${formatTimeToString(
      appSettings?.times.saturday.earliest
    )} - `;
    if (isInsideOpenHours(appSettings)) {
      result += `${formatTimeToString(
        appSettings?.times.saturday.openLatest ?? ""
      )} Saturday & Sunday`;
    } else {
      result += `${formatTimeToString(
        appSettings?.times.saturday.latest
      )} Saturday`;
    }
    return result;
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="bg-white rounded-lg p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center gap-8">
          <div className="flex flex-row justify-between items-start">
            <h2 className="text-3xl font-bold text-center">
              To make a booking outside of our standard trading hours, call us!
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>
          <p className="text-center">
            {`We're sorry! Our online booking system doesn't support bookings on public holidays or outside of ${getActiveHoursString()}. Don't fret! We can still help you in those times, but please give us a call to speak to one of our Sydney-based team members who will be able to book you in.`}
          </p>
          <button
            className="w-full text-center font-bold text-2xl py-3 bg-primary border-2 border-black rounded md:flex-1 capitalize"
            onClick={() => {
              window.location.href = "tel:1300935569";
            }}
          >
            CALL 1300 YELLOW
          </button>
        </div>
      </div>
    </div>
  );
};
