"use server";

import {
  AddressType,
  Client,
  GeocodingAddressComponentType,
  PlaceAutocompleteType,
} from "@googlemaps/google-maps-services-js";
import { GMAPS_API_KEY } from "@/lib/secrets";

const client = new Client();

export const autocomplete = async (input: string) => {
  if (!input) return [];

  try {
    const response = await client.placeAutocomplete({
      params: {
        input,
        key: GMAPS_API_KEY!,
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
        key: GMAPS_API_KEY!,
        fields: ["address_components", "formatted_address", "geometry"],
      },
    });

    const details = response.data.result;

    if (!details) return null;

    const addressComponents = details.address_components ?? [];

    const getComponent = (type: AddressType | GeocodingAddressComponentType) =>
      addressComponents.find((component) => component.types.includes(type))
        ?.short_name || "";

    return {
      address: details.formatted_address || "",
      subpremise: getComponent(AddressType.subpremise),
      street_number: getComponent(AddressType.street_number),
      company: getComponent(GeocodingAddressComponentType.establishment),
      street: getComponent(AddressType.route),
      locality:
        getComponent(AddressType.locality) ||
        getComponent(AddressType.sublocality) ||
        getComponent(AddressType.neighborhood),
      country: getComponent(AddressType.country),
      state: getComponent(AddressType.administrative_area_level_1),
      postal_code: getComponent(AddressType.postal_code),
      lat: details.geometry?.location?.lat || null,
      lng: details.geometry?.location?.lng || null,
    };
  } catch (error) {
    console.error("Get Place Details error:", error);
    return null;
  }
};
