import React, { useEffect, useState } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import { GMAPS_API_KEY } from "@/lib/secrets";
import Image from "next/image";

interface Props {
  startLocation?: GeoLocation;
  endLocation?: GeoLocation;
}

const DEFAULT_CENTER = {
  lat: -33.9225,
  lng: 151.0787,
};

const DEFAULT_ZOOM = 10;

export const DirectionsMap: React.FC<Props> = ({
  startLocation,
  endLocation,
}) => {
  return (
    <APIProvider apiKey={GMAPS_API_KEY!}>
      <Map
        id="yellow-map"
        mapId="yellow-map"
        defaultCenter={DEFAULT_CENTER}
        defaultZoom={DEFAULT_ZOOM}
        className="absolute -bottom-1 -left-1 -right-1 -top-1"
        disableDefaultUI
        disableDoubleClickZoom
        // gestureHandling="none"
        // zoomControl={false}
      >
        {startLocation && (
          <AdvancedMarker
            position={{
              lat: startLocation.lat,
              lng: startLocation.lng,
            }}
          >
            <Image
              src="/startCircle.svg"
              alt="start"
              width={20}
              height={20}
              className="w-5 h-5"
            />
          </AdvancedMarker>
        )}
        {endLocation && (
          <AdvancedMarker
            position={{
              lat: endLocation.lat,
              lng: endLocation.lng,
            }}
          >
            <Image
              src="/finishCircle.svg"
              alt="start"
              width={20}
              height={20}
              className="w-5 h-5"
            />
          </AdvancedMarker>
        )}
        <Directions startLocation={startLocation} endLocation={endLocation} />
      </Map>
    </APIProvider>
  );
};

const Directions: React.FC<Props> = ({ startLocation, endLocation }) => {
  const map = useMap("yellow-map");
  const routesLibrary = useMapsLibrary("routes");
  const [directionsService, setDirectionsService] =
    useState<google.maps.DirectionsService>();
  const [directionsRenderer, setDirectionsRenderer] =
    useState<google.maps.DirectionsRenderer>();

  useEffect(() => {
    if (!routesLibrary || !map) return;
    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(
      new routesLibrary.DirectionsRenderer({
        map,
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: "#fdbb30",
          strokeWeight: 6,
          strokeOpacity: 1,
        },
      })
    );
  }, [routesLibrary, map]);

  useEffect(() => {
    if (
      !directionsService ||
      !directionsRenderer ||
      !startLocation ||
      !endLocation
    )
      return;

    directionsService
      .route({
        origin: startLocation,
        destination: endLocation,
        travelMode: google.maps.TravelMode.DRIVING,
      })
      .then((response) => {
        directionsRenderer.setDirections(response);
      });
  }, [directionsService, directionsRenderer, startLocation, endLocation]);

  useEffect(() => {
    if (map) {
      try {
        if (startLocation && endLocation) {
          const bounds = new google.maps.LatLngBounds();
          bounds.extend(
            new google.maps.LatLng(startLocation.lat, startLocation.lng)
          );
          bounds.extend(
            new google.maps.LatLng(endLocation.lat, endLocation.lng)
          );
          map.fitBounds(bounds);
        } else if (startLocation) {
          map.panTo(startLocation);
          map.setZoom(15);
        } else if (endLocation) {
          map.panTo(endLocation);
          map.setZoom(15);
        }
      } catch (error) {
        console.error(error);
      }
    }
  }, [map, startLocation, endLocation]);

  return null;
};
