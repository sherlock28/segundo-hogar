import { useState, useMemo, useEffect } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import { MarkerCard } from "./MarkerCard";
import { FaUniversity } from "react-icons/fa";
import { RadiusOne } from "./RadiusArea/RadiusArea-1";
import { RadiusTwo } from "./RadiusArea/RadiusArea-2";
import { RadiusThree } from "./RadiusArea/RadiusArea-3";
import { RadiusFour } from "./RadiusArea/RadiusArea-4";
import { RadiusFive } from "./RadiusArea/RadiusArea-5";
import { RadiusSix } from "./RadiusArea/RadiusArea-6";
import { RadiusSeven } from "./RadiusArea/RadiusArea-7";
import { RadiusEight } from "./RadiusArea/RadiusArea-8";
import { RadiusNine } from "./RadiusArea/RadiusArea-9";
import { RadiusTen } from "./RadiusArea/RadiusArea-10";
function getCoordinates(ownership) {
  if (
    ownership === undefined ||
    ownership.coordinate === undefined ||
    ownership.coordinate?.lat === undefined ||
    ownership.coordinate?.lon === undefined
  ) {
    return null;
  }

  const coordinates = {
    lat: +ownership.coordinate?.lat,
    lng: +ownership.coordinate?.lon,
  };

  console.log("Coordinates:", coordinates);
  return coordinates;
}

export const MapSearchForm = ({ markers, height, width }) => {
  const center = useMemo(
    () => ({ lat: -26.81715341828356, lng: -65.19856536761296 }),
    []
  );

  const maxDistance = localStorage.getItem("maxDistance");
  console.log("max distance on map search", maxDistance);

  const calculateZoom = (maxDistance) => {
    const baseZoom = 15;
    const distanceFactor = 1.1;
    const calculatedZoom = baseZoom - Math.log2(maxDistance) * distanceFactor;

    return Math.max(1, Math.min(20, calculatedZoom));
  };

  var zoom = useMemo(() => calculateZoom(maxDistance), [maxDistance ] );
  if(!maxDistance){
    zoom = 15
  }

  height = height || "400px";
  width = width || "100%";

  console.log("markers info: ", markers);

  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);

  const initialPosition = useMemo(() => {
    return markers && markers.length > 0 ? markers[0].position : center;
  }, [markers, center]);

  return (
    <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_PLATFORM_API_KEY}>
      <div style={{ height: height, width: width }}>
        <Map
          zoom={zoom}
          center={center}
          mapId={process.env.REACT_APP_GOOGLE_MAPS_ID}
          mapContainerStyle={{ height: "500px", width: "100%" }}
        >
          {markers &&
            markers.map((marker, index) => (
              <AdvancedMarker
                key={index}
                position={marker.position}
                onClick={() => {
                  setSelected(marker.position);
                  setOpen(true);
                }}
              >
                <Pin />
                {open && selected === marker.position && (
                  <InfoWindow
                    position={marker.position}
                    onCloseClick={() => {
                      setOpen(false);
                    }}
                  >
                    <MarkerCard marker={marker} />
                  </InfoWindow>
                )}
              </AdvancedMarker>
            ))}
          <AdvancedMarker position={center} key="central-marker">
            <div
              style={{
                background: "black",
                padding: ".3rem",
                borderRadius: "50%",
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <FaUniversity fontSize={"22px"} color="white" />
            </div>
          </AdvancedMarker>
          <AdvancedMarker position={center}>
            {maxDistance === "1" && <RadiusOne />}
            {maxDistance === "2" && <RadiusTwo />}
            {maxDistance === "3" && <RadiusThree />}
            {maxDistance === "4" && <RadiusFour />}
            {maxDistance === "5" && <RadiusFive />}
            {maxDistance === "6" && <RadiusSix />}
            {maxDistance === "7" && <RadiusSeven />}
            {maxDistance === "8" && <RadiusEight />}
            {maxDistance === "9" && <RadiusNine />}
            {maxDistance === "10" && <RadiusTen />}
          </AdvancedMarker>
        </Map>
      </div>
    </APIProvider>
  );
};
