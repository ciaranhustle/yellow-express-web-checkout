export enum StorageKey {
  Cart = "cart",
}

export const FETCH_CUSTOMER = "customer";

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
      "Need something sensitive taken with safe hands from point A to B?",
    imageSrc: "/fragileItems.png",
  },
  {
    type: "Something Obscure",
    description:
      "Choose this option if you'd like to book a van for the day or you have a unique / XXXL request.",
    imageSrc: "/obscureItems.png",
  },
];

export const bookingTimeOptions: { time: BookingTime; range: string }[] = [
  { time: "Morning", range: "7:30AM-10AM" },
  { time: "Midday", range: "10AM-2PM" },
  { time: "Afternoon", range: "2PM-6PM" },
];
