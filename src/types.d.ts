interface ApiOptions {
  method?: string;
  data?: object;
}

type BookingType =
  | "Big & Bulky"
  | "Small Items"
  | "Fragile & Sensitive"
  | "Something Obscure";

interface CartState {
  type: BookingType | null;
  when: WhenDetails | null;
  where: WhereDetails | null;
  what: string | null;
  customerDetails: CustomerDetails | null;
  quoteId: string | null;
  couponCode: string | null;
}
type CartAction =
  | { type: "SET_TYPE"; payload: BookingType | null }
  | { type: "SET_WHEN"; payload: Partial<WhenDetails> | null }
  | { type: "SET_WHERE"; payload: Partial<WhereDetails> | null }
  | { type: "SET_WHAT"; payload: string | null }
  | { type: "SET_CUSTOMER_DETAILS"; payload: Partial<CustomerDetails> | null }
  | { type: "SET_COUPON_CODE"; payload: string | null }
  | { type: "SET_QUOTE_ID"; payload: string | null }
  | { type: "CLEAR_CART" }
  | { type: "SET_CART"; payload: CartState };

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
    pickUpAddress: Address;
    dropOffAddress: Address;
  };
  price: number;
  inclusions: string[];
}

type QuoteStatus = "Pending" | "Claimed" | "Expired" | "Paid";

interface QuoteUpdates {
  status?: QuoteStatus;
}

interface QuoteDataProps {
  quote: Quote;
}
