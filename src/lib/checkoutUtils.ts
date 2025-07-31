import { toZonedTime } from "date-fns-tz";
import { TIMEZONE } from "./utils";

export const PICKUP_TIME_SCHEDULE: Record<
  BookingTime,
  { hours: number; minutes: number; ampm: string }
> = {
  Morning: {
    hours: 7,
    minutes: 30,
    ampm: "am",
  },
  Midday: {
    hours: 10,
    minutes: 0,
    ampm: "am",
  },
  Afternoon: {
    hours: 2,
    minutes: 0,
    ampm: "pm",
  },
};

export const createJobFromQuote = (
  quote: Quote,
  bookingAssistOption: BookingAssistOption
): Job => {
  let pickupDate;
  let pickupTime;
  if (quote.bookingDetails.isToday) {
    const now = toZonedTime(new Date(), TIMEZONE);

    if (now.getHours() < 8) {
      pickupDate = now.toISOString();
      pickupTime = {
        hours: 8,
        minutes: 0,
        ampm: "am",
      };
    } else {
      const currentHour = now.getHours();
      const currentMinutes = now.getMinutes();

      const roundedMinutes = Math.ceil(currentMinutes / 15) * 15;
      const additionalHours = Math.floor(roundedMinutes / 60);
      const finalMinutes = roundedMinutes % 60;

      pickupDate = now.toISOString();
      pickupTime = {
        hours: Math.ceil((currentHour + additionalHours) % 12 || 12),
        minutes: finalMinutes,
        ampm: currentHour + additionalHours >= 12 ? "pm" : "am",
      };
    }
  } else {
    pickupDate = quote.bookingDetails.date;
    pickupTime = PICKUP_TIME_SCHEDULE[quote.bookingDetails.time];
  }

  return {
    type: quote.bookingDetails.bookingType,
    pickupDateUTC: pickupDate,
    pickupTime: pickupTime,
    pickupNow: quote.bookingDetails.isToday,
    bookingAssistOption,
    addresses: {
      pickup: {
        location: {
          address: quote.bookingDetails.pickUpAddress.address,
          company: quote.bookingDetails.pickUpAddress.company,
          subpremise: quote.bookingDetails.pickUpAddress.subpremise,
          street_number: quote.bookingDetails.pickUpAddress.street_number,
          street: quote.bookingDetails.pickUpAddress.street,
          locality: quote.bookingDetails.pickUpAddress.locality,
          state: quote.bookingDetails.pickUpAddress.state,
          country: quote.bookingDetails.pickUpAddress.country,
          lat: quote.bookingDetails.pickUpAddress.lat,
          lng: quote.bookingDetails.pickUpAddress.lng,
          postal_code: quote.bookingDetails.pickUpAddress.postal_code,
          parking: "",
        },
        contactInfo: {
          name:
            quote.customerDetails.firstName +
            " " +
            quote.customerDetails.lastName,
          number: quote.customerDetails.mobile ?? "",
          email: quote.customerDetails.email ?? "",
        },
      },
      dropoff: {
        location: {
          address: quote.bookingDetails.dropOffAddress.address,
          company: quote.bookingDetails.dropOffAddress.company,
          subpremise: quote.bookingDetails.dropOffAddress.subpremise,
          street_number: quote.bookingDetails.dropOffAddress.street_number,
          street: quote.bookingDetails.dropOffAddress.street,
          locality: quote.bookingDetails.dropOffAddress.locality,
          state: quote.bookingDetails.dropOffAddress.state,
          country: quote.bookingDetails.dropOffAddress.country,
          lat: quote.bookingDetails.dropOffAddress.lat,
          lng: quote.bookingDetails.dropOffAddress.lng,
          postal_code: quote.bookingDetails.dropOffAddress.postal_code,
          parking: "",
        },
        contactInfo: {
          name:
            quote.customerDetails.firstName +
            " " +
            quote.customerDetails.lastName,
          number: quote.customerDetails.mobile ?? "",
          email: quote.customerDetails.email ?? "",
        },
      },
    },
    items: quote.bookingDetails.description.map((item) => ({
      name: item,
      quantity: 1,
    })),
    options: {
      weight: quote.inclusions.weight,
      loads: quote.inclusions.loads,
      minutes: quote.inclusions.minutes,
      instructions: quote.bookingDetails.instructions,
    },
    variationConditions: {
      fullPrice: quote.fullPrice,
    },
    estimates: {
      price: bookingAssistOption === "TLC" ? quote.tlcPrice : quote.price,
      distance: quote.inclusions.distance ?? 0,
      duration: quote.inclusions.minutes ?? 0,
      tolls: quote.inclusions.tolls ?? 0,
      minutes: quote.inclusions.minutes ?? 0,
    },
    quote: quote._id,
  };
};
