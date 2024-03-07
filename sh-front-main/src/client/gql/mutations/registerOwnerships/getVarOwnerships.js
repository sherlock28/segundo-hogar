export function getVarOwnerships(data) {
  const storedLat = parseFloat(localStorage.getItem("lat"));
  const storedLng = parseFloat(localStorage.getItem("lng"));
  const storedAddress = localStorage.getItem("address");
  let variables = {
    shared: true,
    rooms: data.bedrooms,
    bathrooms: data.bathrooms,
    size: data.size,
    rating: 0,
    ownerships_state: true,
    ownerships_types_id: data.typeHouse,
    owners_id: -1,
    lat: storedLat,
    lon: storedLng,
    address: storedAddress,
    floor: data.floor,
    apartment: data.apartment,
  };

  return variables;
}
