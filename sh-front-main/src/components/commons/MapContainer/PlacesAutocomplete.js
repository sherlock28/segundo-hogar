import React from "react";
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
import "../../../assets/styles.modules.css";

const PlacesAutocomplete = ({ setSelected }) => {
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete();

  const handleSelect = async (address) => {
    setValue(address, false);
    clearSuggestions();

    const extractedAddress = address.split(',')[0].trim();


    const results = await getGeocode({ address });
    const { lat, lng } = await getLatLng(results[0]);

    localStorage.setItem('lat', lat);
    localStorage.setItem('lng', lng);
    localStorage.setItem("address", extractedAddress)

    setSelected({ lat, lng });
    console.log("lat", lat);
    console.log("lng", lng);
    console.log("Adrress", extractedAddress);
  };

  return (
    <Combobox onSelect={handleSelect}>
      <ComboboxInput
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={!ready}
        className="comboboxInput"
        placeholder="Dirección del inmueble"
      />
      <ComboboxPopover
        style={{ 
          position: "absolute",
          zIndex: "9999", 
        }}
      >
        <ComboboxList>
          {status === "OK" &&
            data.map(({ place_id, description }) => (
              <ComboboxOption
                key={place_id}
                value={description}
                className="suggestions"
              />
            ))}
        </ComboboxList>
      </ComboboxPopover>
    </Combobox>
  );
};

export default PlacesAutocomplete;
