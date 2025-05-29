export enum StorageKey {
  Cart = "cart",
}

export const FETCH_CUSTOMER = "customer";
export const FETCH_APP_SETTINGS = "appSettings";
interface BookingTypeOption {
  type: BookingType;
  description: string;
  imageSrc: string;
  imageClass?: string;
}

export const bookingTypeOptions: BookingTypeOption[] = [
  {
    type: "Big & Bulky",
    description:
      "Send, move or deliver anything that fits in our massive vans!",
    imageSrc: "/bigItems.png",
  },
  {
    type: "Small Items",
    description:
      "Up to 6 small items that fit within the passenger cabin space!",
    imageSrc: "/smallItems.png",
  },
  {
    type: "Fragile & Sensitive",
    description:
      "Need something sensitive taken with safe hands from point A to B direct?",
    imageSrc: "/fragileItems.png",
  },
  {
    type: "Corporate Enquiries",
    description:
      "Yellow Express provides a bespoke courier service for companies of all sizes.",
    imageSrc: "/corporateEnquiries.png",
  },
];

export const bookingTimeOptions: {
  time: BookingTime;
  range: string;
  weekendRange?: string;
}[] = [
  { time: "Morning", range: "7:30AM-10AM", weekendRange: "8AM-10AM" },
  { time: "Midday", range: "10AM-2PM" },
  { time: "Afternoon", range: "2PM-6PM" },
];
