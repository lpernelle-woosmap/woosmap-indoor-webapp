//import "./styles.css";
let mapIsLoaded = null;

function initMap() {
  let wooskey = "woos-4fdc8f8d-e161-3fb8-9a57-e1759c71716a";

  const queryParams = new URLSearchParams(window.location.search);
  let forceExtrusion = false;
  let theme = "woosmap_default";

  if (queryParams.get("key") != null) {
    wooskey = queryParams.get("key");
  }
  
  if (queryParams.get("theme") != null) {
    theme = queryParams.get("theme");
  }
  
  if (queryParams.get("forceExtrusion") != null) {
    forceExtrusion = queryParams.get("forceExtrusion");
  }


  window.woosmap.map.config.setApiKey(wooskey);

  
  let mapConf = {
    center: { lat: 48.844437932920535, lng: 2.3743880269761393 },
    zoom: 6,
    gestureHandling: "greedy"
  };
  
  const mapConfOL = {
    gestureHandling: "greedy",
    center: { lat: 45.76767, lng: 4.98138 },
    zoom: 16.4,
    tilt: 45,
    heading: -168,
    styles: [
      {
        featureType: "landscape.natural.background",
        elementType: "geometry.fill",
        stylers: [
          {
            color: "#f2f2f2"
          }
        ]
      },
      {
        featureType: "poi.sports_complex",
        elementType: "geometry",
        stylers: [
          {
            visibility: "off"
          }
        ]
      },
      {
        featureType: "water",
        elementType: "geometry.fill",
        stylers: [
          {
            color: "#F3F8FF"
          }
        ]
      },
      {
        featureType: "road.highway",
        elementType: "geometry.fill",
        stylers: [
          {
            color: "#e5a00b"
          },
          {
            saturation: 60
          },
          {
            lightness: 35
          }
        ]
      },
      {
        featureType: "landscape.man_made",
        elementType: "geometry.fill",
        stylers: [
          {
            color: "#ffffff"
          }
        ]
      },
      {
        featureType: "transit",
        stylers: [
          {
            visibility: "off"
          }
        ]
      },
      {
        featureType: "poi.school",
        elementType: "geometry.fill",
        stylers: [
          {
            color: "#f2f2f2"
          }
        ]
      }
    ]
  };

  let indoorRendererConfiguration = {
    centerMap: true,
    defaultFloor: 0,
    theme: theme,
    forceExtrusion: forceExtrusion
  };
  
  if (queryParams.get("venue") == "ol_vallee_leo") {
     mapConf = mapConfOL;
     theme = "ol_theme1";
    indoorRendererConfiguration.centerMap = false;
  };

  if (queryParams.get("venue") != null) {
    indoorRendererConfiguration.venue = queryParams.get("venue");
  };

  if (queryParams.get("feature") != null) {
    indoorRendererConfiguration.highlightPOIByRef = queryParams.get("feature");
  };

  window.myMap = new window.woosmap.map.Map(document.getElementById("map"), mapConf);
  
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
        window.myMap.fitBounds(bounds);
      }
    }
  );
};

window.initMap = initMap;
