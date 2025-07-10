"use client";

import { GMAPS_API_KEY } from "@/lib/secrets";
import React from "react";
import GooglePlacesAutocomplete, {
  geocodeByPlaceId,
} from "react-google-places-autocomplete";
import { postcodes } from "@/lib/postcodes";
import { toast } from "react-toastify";

interface Props {
  placeholder?: string;
  value: Address | null;
  onChange: (newValue: Address | null) => void;
}

export const AddressAutocomplete: React.FC<Props> = ({
  placeholder,
  value,
  onChange,
}) => {
  const handleChange = async (address: Address | null) => {
    if (!address) {
      onChange(address);
      return;
    }

    if (!address.value?.place_id) {
      return;
    }

    const results = await geocodeByPlaceId(address.value.place_id);

    if (!results || results.length === 0) {
      return;
    }

    const details = results[0];
    const address_components = details.address_components;

    // Check if the address has a postcode in our allowed list
    const postcodeComponent = address_components.find((component) =>
      component.types.includes("postal_code")
    );

    if (!postcodeComponent) {
      toast.error(
        "Failed to validate postcode. Please select a more specific address if possible or contact us for assistance."
      );
      return;
    }

    if (!postcodes.includes(parseInt(postcodeComponent.long_name))) {
      // If postcode is not in our list, don't allow selection
      toast.error(
        "Sorry, we currently only service addresses in the Greater Sydney area. Please select a different address."
      );
      return;
    }

    const geometry = {
      lat: details.geometry.location.lat(),
      lng: details.geometry.location.lng(),
    };
    onChange({
      label: address.label,
      value: { ...address.value, address_components, geometry },
    });
  };

  return (
    <div>
      {window.google && (
        <GooglePlacesAutocomplete
          apiKey={GMAPS_API_KEY}
          autocompletionRequest={{
            componentRestrictions: { country: "au" },
            location: { lat: -33.8688, lng: 151.2093 },
            radius: 100000,
            types: ["geocode", "establishment"],
          }}
          selectProps={{
            value: value,
            onChange: handleChange,
            placeholder: placeholder ?? "Enter address...",
            isClearable: true,
            backspaceRemovesValue: true,
            styles: {
              placeholder: (provided) => ({
                ...provided,
                color: "#101820",
                fontFamily: "Maison Neue, sans-serif",
                fontWeight: 400,
                opacity: 0.3,
                backgroundColor: "transparent",
                marginLeft: 22,
                textAlign: "start",
              }),
              container: (provided) => ({
                ...provided,
                width: "100%",
                backgroundColor: "transparent",
              }),
              input: (provided) => ({
                ...provided,
                width: "100%",
                color: "#000000",
                fontFamily: "Maison Neue, sans-serif",
                fontWeight: 400,
                backgroundColor: "transparent",
                paddingLeft: 20,
                paddingRight: 20,
                paddingTop: 10,
                paddingBottom: 10,
                borderRadius: 4,
                borderWidth: 1,
                borderColor: "#E2E2E2",
                margin: 0,
              }),
              valueContainer: (provided) => ({
                ...provided,
                margin: 0,
                padding: 0,
              }),
              singleValue: (provided) => ({
                ...provided,
                color: "#000000",
                fontFamily: "Maison Neue, sans-serif",
                fontWeight: 400,
                backgroundColor: "transparent",
                paddingLeft: 20,
                paddingRight: 20,
              }),
              control: (provided) => ({
                ...provided,
                width: "100%",
                color: "#000000",
                backgroundColor: "transparent",
                border: 0,
                boxShadow: "none",
              }),
              indicatorsContainer: (provided) => ({
                ...provided,
                display: "none",
              }),
              menu: (provided) => ({
                ...provided,
                zIndex: 9999,
                backgroundColor: "white",
                color: "#101820",
              }),
            },
            noOptionsMessage: () => "No addresses found",
          }}
        />
      )}
    </div>
  );
};
