interface ApiOptions {
  method?: string;
  data?: object;
}

type BookingType =
  | "Big & Bulky"
  | "Small Items"
  | "Fragile & Sensitive"
  | "Corporate Enquiries";

type BookingAssistOption = "DIY" | "TLC";

interface CartState {
  type: BookingType | null;
  when: WhenDetails | null;
  where: WhereDetails | null;
  what: string[] | null;
  customerDetails: CustomerDetails | null;
  quoteId: string | null;
  coupon: Coupon | null;
  bookingAssistOption: BookingAssistOption | null;
  selectedUpsellOption: UpsellOption | null;
}
type CartAction =
  | { type: "SET_TYPE"; payload: BookingType | null }
  | { type: "SET_WHEN"; payload: Partial<WhenDetails> | null }
  | { type: "SET_WHERE"; payload: Partial<WhereDetails> | null }
  | { type: "SET_WHAT"; payload: string[] | null }
  | { type: "SET_CUSTOMER_DETAILS"; payload: Partial<CustomerDetails> | null }
  | { type: "SET_COUPON"; payload: Coupon | null }
  | { type: "CLEAR_COUPON" }
  | { type: "SET_QUOTE_ID"; payload: string | null }
  | { type: "SET_BOOKING_ASSIST_OPTION"; payload: BookingAssistOption | null }
  | { type: "CLEAR_CART" }
  | { type: "SET_CART"; payload: CartState }
  | { type: "SET_UPSELL_OPTION"; payload: UpsellOption | null };

interface AppState {
  settings: object;
}

type AppAction = { type: "SET_SETTINGS"; payload: object };

type BookingTime = "Morning" | "Midday" | "Afternoon";

interface WhenDetails {
  isToday: boolean;
  date: string | null;
  time: BookingTime | null;
}

interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

interface GeoLocation {
  lat: number;
  lng: number;
}

interface Address {
  label: string;
  value: {
    description: string;
    place_id: string;
    address_components: AddressComponent[];
    geometry: GeoLocation;
  };
}

interface WhereDetails {
  pickUpAddress: Address | null;
  dropOffAddress: Address | null;
}

interface WhatDetails {
  description: string;
}

interface Customer {
  _id: string;
  auth0Id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  profilePicture: string;
}

type CustomerDetails = Partial<Customer>;

interface Quote {
  _id: string;
  customerDetails: CustomerDetails;
  bookingDetails: {
    bookingType: BookingType;
    isToday: boolean;
    date: string;
    time: BookingTime;
    pickUpAddress: {
      address: string;
      company: string;
      street_number: string;
      street: string;
      locality: string;
      state: string;
      country: string;
      lat: number;
      lng: number;
      postal_code: string;
    };
    dropOffAddress: {
      address: string;
      company: string;
      street_number: string;
      street: string;
      locality: string;
      state: string;
      country: string;
      lat: number;
      lng: number;
      postal_code: string;
    };
    description: string;
  };
  price: number;
  inclusions: {
    minutes: number;
    weight: number;
    loads: number;
  };
  fullPrice: number;
  tlcFullPrice: number;
  tlcPrice: number;
  expiresOn: string;
  status: QuoteStatus;
  summary: string;
  upsellOptions: {
    label: string;
    speed: 'VIP' | 'RED HOT';
    price: number;
    tlcPrice: number;
    tlcFullPrice: number;
    fullPrice: number;
  }[] | [];
}

type QuoteStatus = "Pending" | "Claimed" | "Expired" | "Paid";

interface QuoteUpdates {
  status?: QuoteStatus;
}

interface QuoteDataProps {
  quote: Quote;
}

interface Job {
  type: BookingType;
  pickupDateUTC: string;
  pickupTime: {
    hours: number,
    minutes: number,
    ampm: string
  };
  bookingAssistOption: BookingAssistOption;
  pickupNow: boolean;
  addresses: {
    pickup: {
      location: {
        address: string;
        company: string;
        street_number: string;
        street: string;
        locality: string;
        state: string;
        country: string;
        lat: number;
        lng: number;
        postal_code: string;
        parking: string;
      };
      contactInfo: {
        name: string;
        number: string;
        email: string;
      };
    };
    dropoff: {
      location: {
        address: string;
        company: string;
        street_number: string;
        street: string;
        locality: string;
        state: string;
        country: string;
        lat: number;
        lng: number;
        postal_code: string;
        parking: string;
      };
      contactInfo: {
        name: string;
        number: string;
        email: string;
      };
    };
  };
  items: {
    name: BookingType;
    quantity: number;
    description: string;
  }[];
  options: {
    weight: number;
    loads: number;
    minutes: number;
  };
  variationConditions: {
    fullPrice: number;
  };
  estimates: {
    price: number;
    distance: number;
    duration: number;
  };
  upsellApplied?: string;
}

interface Size {
  icon: string;
  title: string;
  description: string;
  addition: number;
}

interface DeliverySpeed {
  icon: string;
  title: string;
  description: string;
  rate?: number;
  pricingId: string;
  multiplier?: number;
}

interface Variations {
  sizes?: Size[];
  speeds: DeliverySpeed[];
}

interface Product {
  title?: string;
  description: string;
  value: string;
  image?: string;
  type: 'Delivery' | 'Addon' | 'Time' | 'Distance';
  variations?: Variations;
  active: boolean;
  imageSource?: string;
  price?: number;
  basePickup?: number;
  baseRate?: number;
}

interface Coupon {
  name: string;
  code: string;
  value: number;
}
