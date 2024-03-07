import { useState, useRef, useEffect, useMemo } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css";
import { from } from "@apollo/client";
import PlacesAutocomplete from "./PlacesAutocomplete";
import { Loading } from "../Loading";

export default function Places() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_PLATFORM_API_KEY,
    libraries: ["places"],
  });

  if (!isLoaded) return <Loading />;
  return <NewMap />;
}

export const NewMap = ({ coordinates }) => {
  const center = useMemo(
    () => coordinates || { lat: -26.81715341828356, lng: -65.19856536761296 },
    [coordinates]
  );
  const [selected, setSelected] = useState(center);

  return (
    <>
      <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_PLATFORM_API_KEY}>
        <div style={{ height: "500px", width: "500px", margin: "auto" }}>
          <div
            className="places-container"
            style={{ width: "500px", height: "40px" }}
          >
            <PlacesAutocomplete setSelected={setSelected} />
          </div>
          <GoogleMap
            zoom={14}
            center={selected || coordinates}
            mapId={process.env.REACT_APP_GOOGLE_MAPS_ID}
            mapContainerStyle={{ height: "500px", width: "500px" }}
          >
            {selected && <Marker position={selected} />}
          </GoogleMap>
        </div>
      </APIProvider>
    </>
  );
};
