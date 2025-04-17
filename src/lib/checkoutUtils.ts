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
  if (quote.bookingDetails.isToday) {
    const now = new Date();
    quote.bookingDetails.date = now.toISOString();

    // Determine time slot based on current hour
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();

    if (currentHour < 10 || (currentHour === 10 && currentMinutes === 0)) {
      quote.bookingDetails.time = "Morning";
    } else if (
      currentHour < 14 ||
      (currentHour === 14 && currentMinutes === 0)
    ) {
      quote.bookingDetails.time = "Midday";
    } else {
      quote.bookingDetails.time = "Afternoon";
    }
  }

  return {
    type: quote.bookingDetails.bookingType,
    pickupDateUTC: quote.bookingDetails.date,
    pickupTime: PICKUP_TIME_SCHEDULE[quote.bookingDetails.time],
    pickupNow: quote.bookingDetails.isToday,
    bookingAssistOption,
    addresses: {
      pickup: {
        location: {
          address: quote.bookingDetails.pickUpAddress.address,
          company: quote.bookingDetails.pickUpAddress.company,
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
    },
    variationConditions: {
      fullPrice: quote.fullPrice,
    },
    estimates: {
      price: bookingAssistOption === "TLC" ? quote.tlcPrice : quote.price,
      distance: 0,
      duration: 0,
    },
  };
};
