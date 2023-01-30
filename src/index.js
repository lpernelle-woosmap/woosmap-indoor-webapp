//import "./styles.css";
let mapIsLoaded = null;

function initMap() {
  let wooskey = "woos-4fdc8f8d-e161-3fb8-9a57-e1759c71716a";

  const queryParams = new URLSearchParams(window.location.search);

  if (queryParams.get("key") != null) {
    wooskey = queryParams.get("key");
  }

  window.woosmap.map.config.setApiKey(wooskey);

  window.myMap = new window.woosmap.map.Map(document.getElementById("map"), {
    center: { lat: 48.844437932920535, lng: 2.3743880269761393 },
    zoom: 6,
    gestureHandling: "greedy"
  });

  const indoorRendererConfiguration = {
    centerMap: false,
    defaultFloor: 0
  };

  if (queryParams.get("venue") != null) {
    indoorRendererConfiguration.venue = queryParams.get("venue");
  }

  if (queryParams.get("feature") != null) {
    indoorRendererConfiguration.highlightPOIByRef = queryParams.get("feature");
  }

  const indoorWidget = new window.woosmap.map.IndoorWidget(
    null,
    indoorRendererConfiguration
  );
  indoorWidget.setMap(window.myMap);

  let venueLoadedListener = indoorWidget.addListener(
    "indoor_venue_loaded",
    (venue) => {
      mapIsLoaded = true;
      if (queryParams.get("building") != null) {
        let buildingValue = queryParams.get("building");
        const building = venue.buildings.filter(
          (building) => building.ref === buildingValue
        )[0];
        console.log(building);
        const bbox = building.levels.filter((level) => level.level === 0)[0].bbox;
        console.log(bbox);
        const bounds = new woosmap.map.LatLngBounds(
          {
            lng: bbox[0],
            lat: bbox[1]
          },
          {
            lng: bbox[2],
            lat: bbox[3]
          }
        );
        window.map.fitBounds(bounds);
      }
    }
  );
};

window.initMap = initMap;
