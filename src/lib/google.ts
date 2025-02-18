"use server";

import {
  AddressType,
  Client,
  GeocodingAddressComponentType,
  PlaceAutocompleteType,
} from "@googlemaps/google-maps-services-js";

const client = new Client();

export const autocomplete = async (input: string) => {
  if (!input) return [];

  try {
    const response = await client.placeAutocomplete({
      params: {
        input,
        key: process.env.GMAPS_API_KEY!,
        types: PlaceAutocompleteType.regions,
        components: ["country:au"],
      },
    });

    return response.data.predictions;
  } catch (error) {
    console.error(error);
  }
};

export const getFormattedAddress = async (placeId: string) => {
  if (!placeId) return null;

  try {
    const response = await client.placeDetails({
      params: {
        place_id: placeId,
        key: process.env.GMAPS_API_KEY!,
        fields: ["address_components", "formatted_address"],
      },
    });

    const details = response.data.result;

    if (!details) return null;

    const addressComponents = details.address_components ?? [];

    const getComponent = (type: AddressType | GeocodingAddressComponentType) =>
      addressComponents.find((component) => component.types.includes(type))
        ?.short_name || "";

    return {
      country: getComponent(AddressType.country),
      postcode: getComponent(AddressType.postal_code),
      suburb:
        getComponent(AddressType.locality) ||
        getComponent(AddressType.sublocality) ||
        getComponent(AddressType.neighborhood),
      state: getComponent(AddressType.administrative_area_level_1),
      details: details.formatted_address || "",
    };
  } catch (error) {
    console.error("Get Place Details error:", error);
    return null;
  }
};
