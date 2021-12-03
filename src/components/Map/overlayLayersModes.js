const Observations = {
  Discharge: [
    "Ukrainian gauges",
    "Ukrainian gauges (non-operate)",
    "Belarusian gauges",
  ],
  WaterChemistry: ["Hydromet network", "Kyivvodokanal gauge"],
};
const chartModes = [
  "Yearly",
  "Monthly",
  "Daily",
  "Annual Daily",
  "Annual Monthly",
];
const chartOptions = [
  "Mean",
  "Min",
  "Max",
  "Frequency Curve",
  "Difference Curve",
];
function checkMode(currentClickedOverlayLayers, mode, currentOption) {
  if (!currentClickedOverlayLayers[0]) {
    return !(
      mode === "Daily" &&
      ["Min", "Max", "Difference Curve"].includes(currentOption)
    );
  }
  if (
    !currentClickedOverlayLayers.length ||
    currentClickedOverlayLayers.some(
      (overlay) =>
        overlay.parentName === "Discharge" &&
        Observations.Discharge.includes(overlay.name)
    )
  ) {
    return !(
      mode === "Daily" &&
      ["Min", "Max", "Difference Curve"].includes(currentOption)
    );
  }
  if (
    currentClickedOverlayLayers.some(
      (overlay) =>
        overlay.parentName === "Water chemistry" &&
        overlay.name === "Hydromet network"
    )
  ) {
    return (
      ["Daily", "Annual Monthly"].includes(mode) && currentOption === "Mean"
    );
  }
  if (
    currentClickedOverlayLayers.some(
      (overlay) =>
        overlay.parentName === "Water chemistry" &&
        overlay.name === "Kyivvodokanal gauge"
    )
  ) {
    return (
      ["Mean", "Min", "Max"].includes(currentOption) &&
      !(mode === "Daily" && ["Min", "Max"].includes(currentOption))
    );
  }
  return true;
}
function checkOption(currentClickedOverlayLayers, option, currentMode) {
  if (!currentClickedOverlayLayers[0]) {
    return !(
      ["Min", "Max", "Difference Curve"].includes(option) &&
      currentMode === "Daily"
    );
  }
  if (
    !currentClickedOverlayLayers.length ||
    currentClickedOverlayLayers.some(
      (overlay) =>
        overlay.parentName === "Discharge" &&
        Observations.Discharge.includes(overlay.name)
    )
  ) {
    return !(
      ["Min", "Max", "Difference Curve"].includes(option) &&
      currentMode === "Daily"
    );
  }
  if (
    currentClickedOverlayLayers.some(
      (overlay) =>
        overlay.parentName === "Water chemistry" &&
        overlay.name === "Hydromet network"
    )
  ) {
    return (
      ["Daily", "Annual Monthly"].includes(currentMode) && option === "Mean"
    );
  }
  if (
    currentClickedOverlayLayers.some(
      (overlay) =>
        overlay.parentName === "Water chemistry" &&
        overlay.name === "Kyivvodokanal gauge"
    )
  ) {
    return (
      !(currentMode === "Daily" && ["Min", "Max"].includes(option)) &&
      ["Mean", "Min", "Max"].includes(option)
    );
  }
  return true;
}
function findItemByItem(clickedOverlay, searchedProperties, properties) {
  if (
    clickedOverlay.parentName === "Discharge" &&
    clickedOverlay.name === "Ukrainian gauges"
  ) {
    return (
      searchedProperties.Code === properties.Code &&
      searchedProperties.Gauge_eng === properties.Gauge_eng &&
      searchedProperties.River_eng === properties.River_eng
    );
  }
  if (
    clickedOverlay.parentName === "Water chemistry" &&
    clickedOverlay.name === "Hydromet network"
  ) {
    return (
      searchedProperties.ID === properties.ID &&
      searchedProperties.Gauge === properties.Gauge &&
      searchedProperties.Basin === properties.Basin &&
      searchedProperties.Place === properties.Place
    );
  }
  if (
    clickedOverlay.parentName === "Water chemistry" &&
    clickedOverlay.name === "Kyivvodokanal gauge"
  ) {
    return (
      searchedProperties.ID === properties.ID &&
      searchedProperties.Gauge === properties.Gauge &&
      searchedProperties.Basin === properties.Basin
    );
  }
  if (
    clickedOverlay.parentName === "Historical observations" &&
    clickedOverlay.name === "Ukraine (1881-2020)"
  ) {
    return (
      searchedProperties.name_UA === properties.name_UA &&
      searchedProperties.name_EN === properties.name_EN
    );
  }
  if (
    clickedOverlay.parentName === "Historical observations" &&
    clickedOverlay.name === "Meteorological stations (1881-2020)"
  ) {
    return (
      searchedProperties.St_UA === properties.St_UA &&
      searchedProperties.St_EN === properties.St_EN &&
      searchedProperties.Lat === properties.Lat &&
      searchedProperties.Long === properties.Long
    );
  }
  if (
    clickedOverlay.parentName === "Climate projections (Euro-CORDEX)" &&
    clickedOverlay.name === "grid 0.11x0.11°"
  ) {
    return (
      searchedProperties.id === properties.id &&
      searchedProperties.lat === properties.lat &&
      searchedProperties.lon === properties.lon
    );
  }
  if (
    clickedOverlay.parentName === "Climate projections (Euro-CORDEX)" &&
    clickedOverlay.name === "Ukraine"
  ) {
    return (
      searchedProperties.name_UA === properties.name_UA &&
      searchedProperties.name_EN === properties.name_EN
    );
  }
  if (
    clickedOverlay.parentName === "Climate projections (Euro-CORDEX)" &&
    clickedOverlay.name === "Administrative oblasts"
  ) {
    return (
      searchedProperties.ID === properties.ID &&
      searchedProperties.NAME_UA === properties.NAME_UA &&
      searchedProperties.CODENAME === properties.CODENAME
    );
  }
  if (
    clickedOverlay.parentName === "Climate projections (Euro-CORDEX)" &&
    clickedOverlay.name === "Administrative rayons"
  ) {
    return (
      searchedProperties.COD_2 === properties.COD_2 &&
      searchedProperties.ADMIN_2 === properties.ADMIN_2 &&
      searchedProperties.ADMIN_2_eng === properties.ADMIN_2_eng
    );
  }
  if (
    clickedOverlay.parentName === "Climate projections (Euro-CORDEX)" &&
    clickedOverlay.name === "Territorial communities"
  ) {
    return (
      searchedProperties.COD_3 === properties.COD_3 &&
      searchedProperties.ADMIN_3 === properties.ADMIN_3 &&
      searchedProperties.ADMIN_3_eng === properties.ADMIN_3_eng
    );
  }
  if (
    clickedOverlay.parentName === "Climate projections (Euro-CORDEX)" &&
    clickedOverlay.name === "River basins"
  ) {
    return (
      searchedProperties.ID === properties.ID &&
      searchedProperties.Basin === properties.Basin &&
      (searchedProperties.Subbasin_eng || null) ===
        (properties.Subbasin_eng || null)
    );
  }
  throw new Error("Overlay is not found (findItemByItem)");
}
function findGauge(clickedOverlay, properties) {
  if (
    clickedOverlay.parentName === "Discharge" &&
    clickedOverlay.name === "Ukrainian gauges"
  ) {
    return (gauge) =>
      gauge.code === properties.Code &&
      gauge.nameEng === properties.Gauge_eng &&
      gauge.riverEng === properties.River_eng &&
      gauge.overlay.parentName === clickedOverlay.parentName &&
      gauge.overlay.name === clickedOverlay.name;
  }
  if (
    clickedOverlay.parentName === "Water chemistry" &&
    clickedOverlay.name === "Hydromet network"
  ) {
    return (gauge) =>
      gauge.id === properties.ID &&
      gauge.nameUkr === properties.Gauge &&
      gauge.basinUkr === properties.Basin &&
      gauge.placeUkr === properties.Place &&
      gauge.overlay.parentName === clickedOverlay.parentName &&
      gauge.overlay.name === clickedOverlay.name;
  }
  if (
    clickedOverlay.parentName === "Water chemistry" &&
    clickedOverlay.name === "Kyivvodokanal gauge"
  ) {
    return (gauge) =>
      gauge.id === properties.ID &&
      gauge.nameUkr === properties.Gauge &&
      gauge.basinUkr === properties.Basin &&
      gauge.overlay.parentName === clickedOverlay.parentName &&
      gauge.overlay.name === clickedOverlay.name;
  }
  if (
    clickedOverlay.parentName === "Historical observations" &&
    clickedOverlay.name === "Ukraine (1881-2020)"
  ) {
    return (gauge) =>
      gauge.nameUkr === properties.name_UA &&
      gauge.nameEng === properties.name_EN &&
      gauge.type === "oblasts" &&
      gauge.overlay.parentName === clickedOverlay.parentName &&
      gauge.overlay.name === clickedOverlay.name;
  }
  if (
    clickedOverlay.parentName === "Historical observations" &&
    clickedOverlay.name === "Meteorological stations (1881-2020)"
  ) {
    return (gauge) =>
      gauge.nameUkr === properties.St_UA &&
      gauge.nameEng === properties.St_EN &&
      gauge.lat === properties.Lat &&
      gauge.lon === properties.Long &&
      gauge.overlay.parentName === clickedOverlay.parentName &&
      gauge.overlay.name === clickedOverlay.name;
  }
  if (
    clickedOverlay.parentName === "Climate projections (Euro-CORDEX)" &&
    clickedOverlay.name === "grid 0.11x0.11°"
  ) {
    return (gauge) =>
      gauge.id === properties.id &&
      gauge.lat === properties.lat &&
      gauge.lon === properties.lon &&
      gauge.overlay.parentName === clickedOverlay.parentName &&
      gauge.overlay.name === clickedOverlay.name;
  }
  if (
    clickedOverlay.parentName === "Climate projections (Euro-CORDEX)" &&
    clickedOverlay.name === "Ukraine"
  ) {
    return (gauge) =>
      gauge.nameUkr === properties.name_UA &&
      gauge.nameEng === properties.name_EN &&
      gauge.type === "oblasts" &&
      gauge.overlay.parentName === clickedOverlay.parentName &&
      gauge.overlay.name === clickedOverlay.name;
  }
  if (
    clickedOverlay.parentName === "Climate projections (Euro-CORDEX)" &&
    clickedOverlay.name === "Administrative oblasts"
  ) {
    return (gauge) =>
      gauge.id === properties.ID &&
      gauge.nameUkr === properties.NAME_UA &&
      gauge.codeName === properties.CODENAME &&
      gauge.overlay.parentName === clickedOverlay.parentName &&
      gauge.overlay.name === clickedOverlay.name;
  }
  if (
    clickedOverlay.parentName === "Climate projections (Euro-CORDEX)" &&
    clickedOverlay.name === "Administrative rayons"
  ) {
    return (gauge) =>
      gauge.cod === properties.COD_2 &&
      gauge.nameUkr === properties.ADMIN_2 &&
      gauge.nameEng === properties.ADMIN_2_eng &&
      gauge.overlay.parentName === clickedOverlay.parentName &&
      gauge.overlay.name === clickedOverlay.name;
  }
  if (
    clickedOverlay.parentName === "Climate projections (Euro-CORDEX)" &&
    clickedOverlay.name === "Territorial communities"
  ) {
    return (gauge) =>
      gauge.cod === properties.COD_3 &&
      gauge.nameUkr === properties.ADMIN_3 &&
      gauge.nameEng === properties.ADMIN_3_eng &&
      gauge.overlay.parentName === clickedOverlay.parentName &&
      gauge.overlay.name === clickedOverlay.name;
  }
  if (
    clickedOverlay.parentName === "Climate projections (Euro-CORDEX)" &&
    clickedOverlay.name === "River basins"
  ) {
    return (gauge) =>
      gauge.id === properties.ID &&
      gauge.basin === properties.Basin &&
      gauge.subbasin === (properties.Subbasin_eng || null) &&
      gauge.overlay.parentName === clickedOverlay.parentName &&
      gauge.overlay.name === clickedOverlay.name;
  }
  throw new Error("Overlay is not found (findGauge)");
}
function findGaugeByGauge(gauge, mode = "positive") {
  return (g) => {
    let res = 1;
    // eslint-disable-next-line
    for (let key in gauge) {
      res = g[key] === gauge[key] && res;
    }
    if (mode === "positive") {
      return !!res;
    }
    return !res;
  };
}
function filterGauge(clickedOverlay, properties) {
  if (
    clickedOverlay.parentName === "Discharge" &&
    clickedOverlay.name === "Ukrainian gauges"
  ) {
    return (gauge) => {
      if (
        gauge.code === properties.Code &&
        gauge.nameEng === properties.Gauge_eng &&
        gauge.riverEng === properties.River_eng &&
        gauge.overlay.parentName === clickedOverlay.parentName &&
        gauge.overlay.name === clickedOverlay.name
      ) {
        return false;
      }
      return true;
    };
  }
  if (
    clickedOverlay.parentName === "Water chemistry" &&
    clickedOverlay.name === "Hydromet network"
  ) {
    return (gauge) => {
      if (
        gauge.id === properties.ID &&
        gauge.nameUkr === properties.Gauge &&
        gauge.basinUkr === properties.Basin &&
        gauge.placeUkr === properties.Place &&
        gauge.overlay.parentName === clickedOverlay.parentName &&
        gauge.overlay.name === clickedOverlay.name
      ) {
        return false;
      }
      return true;
    };
  }
  if (
    clickedOverlay.parentName === "Water chemistry" &&
    clickedOverlay.name === "Kyivvodokanal gauge"
  ) {
    return (gauge) => {
      if (
        gauge.id === properties.ID &&
        gauge.nameUkr === properties.Gauge &&
        gauge.basinUkr === properties.Basin &&
        gauge.overlay.parentName === clickedOverlay.parentName &&
        gauge.overlay.name === clickedOverlay.name
      ) {
        return false;
      }
      return true;
    };
  }
  if (
    clickedOverlay.parentName === "Historical observations" &&
    clickedOverlay.name === "Ukraine (1881-2020)"
  ) {
    return (gauge) => {
      if (
        gauge.nameUkr === properties.name_UA &&
        gauge.nameEng === properties.name_EN &&
        gauge.type === "oblasts" &&
        gauge.overlay.parentName === clickedOverlay.parentName &&
        gauge.overlay.name === clickedOverlay.name
      ) {
        return false;
      }
      return true;
    };
  }
  if (
    clickedOverlay.parentName === "Historical observations" &&
    clickedOverlay.name === "Meteorological stations (1881-2020)"
  ) {
    return (gauge) => {
      if (
        gauge.nameUkr === properties.St_UA &&
        gauge.nameEng === properties.St_EN &&
        gauge.lat === properties.Lat &&
        gauge.lon === properties.Long &&
        gauge.overlay.parentName === clickedOverlay.parentName &&
        gauge.overlay.name === clickedOverlay.name
      ) {
        return false;
      }
      return true;
    };
  }
  if (
    clickedOverlay.parentName === "Climate projections (Euro-CORDEX)" &&
    clickedOverlay.name === "grid 0.11x0.11°"
  ) {
    return (gauge) => {
      if (
        gauge.id === properties.id &&
        gauge.lat === properties.lat &&
        gauge.lon === properties.lon &&
        gauge.overlay.parentName === clickedOverlay.parentName &&
        gauge.overlay.name === clickedOverlay.name
      ) {
        return false;
      }
      return true;
    };
  }
  if (
    clickedOverlay.parentName === "Climate projections (Euro-CORDEX)" &&
    clickedOverlay.name === "Ukraine"
  ) {
    return (gauge) => {
      if (
        gauge.nameUkr === properties.name_UA &&
        gauge.nameEng === properties.name_EN &&
        gauge.type === "oblasts" &&
        gauge.overlay.parentName === clickedOverlay.parentName &&
        gauge.overlay.name === clickedOverlay.name
      ) {
        return false;
      }
      return true;
    };
  }
  if (
    clickedOverlay.parentName === "Climate projections (Euro-CORDEX)" &&
    clickedOverlay.name === "Administrative oblasts"
  ) {
    return (gauge) => {
      if (
        gauge.id === properties.ID &&
        gauge.nameUkr === properties.NAME_UA &&
        gauge.codeName === properties.CODENAME &&
        gauge.overlay.parentName === clickedOverlay.parentName &&
        gauge.overlay.name === clickedOverlay.name
      ) {
        return false;
      }
      return true;
    };
  }
  if (
    clickedOverlay.parentName === "Climate projections (Euro-CORDEX)" &&
    clickedOverlay.name === "Administrative rayons"
  ) {
    return (gauge) => {
      if (
        gauge.cod === properties.COD_2 &&
        gauge.nameUkr === properties.ADMIN_2 &&
        gauge.nameEng === properties.ADMIN_2_eng &&
        gauge.overlay.parentName === clickedOverlay.parentName &&
        gauge.overlay.name === clickedOverlay.name
      ) {
        return false;
      }
      return true;
    };
  }
  if (
    clickedOverlay.parentName === "Climate projections (Euro-CORDEX)" &&
    clickedOverlay.name === "Territorial communities"
  ) {
    return (gauge) => {
      if (
        gauge.cod === properties.COD_3 &&
        gauge.nameUkr === properties.ADMIN_3 &&
        gauge.nameEng === properties.ADMIN_3_eng &&
        gauge.overlay.parentName === clickedOverlay.parentName &&
        gauge.overlay.name === clickedOverlay.name
      ) {
        return false;
      }
      return true;
    };
  }
  if (
    clickedOverlay.parentName === "Climate projections (Euro-CORDEX)" &&
    clickedOverlay.name === "River basins"
  ) {
    return (gauge) => {
      if (
        gauge.id === properties.ID &&
        gauge.basin === properties.Basin &&
        gauge.subbasin === (properties.Subbasin_eng || null) &&
        gauge.overlay.parentName === clickedOverlay.parentName &&
        gauge.overlay.name === clickedOverlay.name
      ) {
        return false;
      }
      return true;
    };
  }
  throw new Error("Overlay is not found (filterGauge)");
}
function getDefaultItemName(clickedOverlay, properties) {
  if (
    clickedOverlay.parentName === "Historical observations" &&
    clickedOverlay.name === "Ukraine (1881-2020)"
  ) {
    return properties.name_EN;
  }
  if (
    clickedOverlay.parentName === "Historical observations" &&
    clickedOverlay.name === "Meteorological stations (1881-2020)"
  ) {
    return properties.St_EN;
  }
  if (
    clickedOverlay.parentName === "Climate projections (Euro-CORDEX)" &&
    clickedOverlay.name === "Administrative oblasts"
  ) {
    return properties.NAME_LAT.substr(-3) === "ska" ||
      properties.NAME_LAT.substr(-3) === "zka"
      ? `${properties.NAME_LAT} Oblast`
      : `${properties.NAME_LAT}`;
  }
  if (
    clickedOverlay.parentName === "Climate projections (Euro-CORDEX)" &&
    clickedOverlay.name === "grid 0.11x0.11°"
  ) {
    return `Latitude: ${properties.lat}, Longitude: ${properties.lon}`;
  }
  if (
    clickedOverlay.parentName === "Climate projections (Euro-CORDEX)" &&
    clickedOverlay.name === "Administrative rayons"
  ) {
    return properties.ADMIN_2_eng;
  }
  if (
    clickedOverlay.parentName === "Climate projections (Euro-CORDEX)" &&
    clickedOverlay.name === "Territorial communities"
  ) {
    return `${properties.ADMIN_3_eng} territorial community`;
  }
  if (
    clickedOverlay.parentName === "Climate projections (Euro-CORDEX)" &&
    clickedOverlay.name === "Ukraine"
  ) {
    return properties.name_EN;
  }
  if (
    clickedOverlay.parentName === "Climate projections (Euro-CORDEX)" &&
    clickedOverlay.name === "River basins"
  ) {
    return properties.Subbasin_eng
      ? `${properties.Subbasin_eng}`
      : `${properties.Basin}`;
  }
  throw new Error("Overlay is not found (getDefaultItemName)");
}
function getGaugeObj(clickedOverlay, properties) {
  if (
    clickedOverlay.parentName === "Discharge" &&
    clickedOverlay.name === "Ukrainian gauges"
  ) {
    return {
      nameEng: properties.Gauge_eng,
      riverEng: properties.River_eng,
      code: properties.Code,
      getGaugeName: getDefaultItemName(clickedOverlay, properties),
      type: "gauge",
      overlay: clickedOverlay,
    };
  }
  if (
    clickedOverlay.parentName === "Water chemistry" &&
    clickedOverlay.name === "Hydromet network"
  ) {
    return {
      nameUkr: properties.Gauge,
      basinUkr: properties.Basin,
      placeUkr: properties.Place,
      id: properties.ID,
      getGaugeName: getDefaultItemName(clickedOverlay, properties),
      type: "gauge",
      overlay: clickedOverlay,
    };
  }
  if (
    clickedOverlay.parentName === "Water chemistry" &&
    clickedOverlay.name === "Kyivvodokanal gauge"
  ) {
    return {
      nameUkr: properties.Gauge,
      basinUkr: properties.Basin,
      id: properties.ID,
      getGaugeName: getDefaultItemName(clickedOverlay, properties),
      type: "gauge",
      overlay: clickedOverlay,
    };
  }
  if (
    clickedOverlay.parentName === "Historical observations" &&
    clickedOverlay.name === "Ukraine (1881-2020)"
  ) {
    return {
      nameUkr: properties.name_UA,
      nameEng: properties.name_EN,
      getGaugeName: getDefaultItemName(clickedOverlay, properties),
      type: "oblasts",
      overlay: clickedOverlay,
    };
  }
  if (
    clickedOverlay.parentName === "Historical observations" &&
    clickedOverlay.name === "Meteorological stations (1881-2020)"
  ) {
    return {
      nameEng: properties.St_EN,
      nameUkr: properties.St_UA,
      lat: properties.Lat,
      lon: properties.Long,
      getGaugeName: getDefaultItemName(clickedOverlay, properties),
      type: "gauge",
      overlay: clickedOverlay,
    };
  }
  if (
    clickedOverlay.parentName === "Climate projections (Euro-CORDEX)" &&
    clickedOverlay.name === "grid 0.11x0.11°"
  ) {
    return {
      id: properties.id,
      lat: properties.lat,
      lon: properties.lon,
      getGaugeName: getDefaultItemName(clickedOverlay, properties),
      type: "gauge",
      overlay: clickedOverlay,
    };
  }
  if (
    clickedOverlay.parentName === "Climate projections (Euro-CORDEX)" &&
    clickedOverlay.name === "Ukraine"
  ) {
    return {
      nameUkr: properties.name_UA,
      nameEng: properties.name_EN,
      getGaugeName: getDefaultItemName(clickedOverlay, properties),
      type: "oblasts",
      overlay: clickedOverlay,
    };
  }
  if (
    clickedOverlay.parentName === "Climate projections (Euro-CORDEX)" &&
    clickedOverlay.name === "Administrative oblasts"
  ) {
    return {
      id: properties.ID,
      nameUkr: properties.NAME_UA,
      nameEng: properties.NAME_LAT,
      codeName: properties.CODENAME,
      getGaugeName: getDefaultItemName(clickedOverlay, properties),
      type: "oblasts",
      overlay: clickedOverlay,
    };
  }
  if (
    clickedOverlay.parentName === "Climate projections (Euro-CORDEX)" &&
    clickedOverlay.name === "Administrative rayons"
  ) {
    return {
      cod: properties.COD_2,
      nameUkr: properties.ADMIN_2,
      nameEng: properties.ADMIN_2_eng,
      getGaugeName: getDefaultItemName(clickedOverlay, properties),
      type: "oblasts",
      overlay: clickedOverlay,
    };
  }
  if (
    clickedOverlay.parentName === "Climate projections (Euro-CORDEX)" &&
    clickedOverlay.name === "Territorial communities"
  ) {
    return {
      cod: properties.COD_3,
      nameUkr: properties.ADMIN_3,
      nameEng: properties.ADMIN_3_eng,
      getGaugeName: getDefaultItemName(clickedOverlay, properties),
      type: "oblasts",
      overlay: clickedOverlay,
    };
  }
  if (
    clickedOverlay.parentName === "Climate projections (Euro-CORDEX)" &&
    clickedOverlay.name === "River basins"
  ) {
    return {
      id: properties.ID,
      basin: properties.Basin,
      subbasin: properties.Subbasin_eng || null,
      getGaugeName: getDefaultItemName(clickedOverlay, properties),
      type: "basin",
      overlay: clickedOverlay,
    };
  }
  throw new Error("Overlay is not found (getGaugeObj)");
}
function getGaugeMarkerStyle(clickedOverlay) {
  if (
    clickedOverlay.parentName === "Discharge" &&
    clickedOverlay.name === "Ukrainian gauges"
  ) {
    return {
      active: { fillColor: "#dce653", radius: 7.5 },
      passive: {
        fillColor: "#4b79b6",
        radius: 6,
      },
      borderColor: "#294b67",
    };
  }
  if (
    clickedOverlay.parentName === "Water chemistry" &&
    clickedOverlay.name === "Hydromet network"
  ) {
    return {
      active: { fillColor: "#dce653", radius: 7.5 },
      passive: {
        fillColor: "#ffa552",
        radius: 6,
      },
      borderColor: "#294b67",
    };
  }
  if (
    clickedOverlay.parentName === "Water chemistry" &&
    clickedOverlay.name === "Kyivvodokanal gauge"
  ) {
    return {
      active: { fillColor: "#dce653", radius: 7.5 },
      passive: {
        fillColor: "#ac92a6",
        radius: 6,
      },
      borderColor: "#294b67",
    };
  }
  if (
    (clickedOverlay.parentName === "Climate projections (Euro-CORDEX)" &&
      clickedOverlay.name === "grid 0.11x0.11°") ||
    (clickedOverlay.parentName === "Historical observations" &&
      clickedOverlay.name === "Meteorological stations (1881-2020)")
  ) {
    return {
      active: {
        fillColor: "#dce653",
        radius: 6.5,
        color: "#294b67",
        weight: 1.3,
        fillOpacity: 1,
      },
      passive: {
        color: "#294b67",
        fillColor: "rgba(57, 61, 63, 0.25)",
        radius: 5,
        weight: 1.3,
        fillOpacity: 1,
      },
      borderColor: "#294b67",
    };
  }
  if (
    (clickedOverlay.parentName === "Climate projections (Euro-CORDEX)" &&
      clickedOverlay.name === "Administrative oblasts") ||
    (clickedOverlay.parentName === "Climate projections (Euro-CORDEX)" &&
      clickedOverlay.name === "River basins") ||
    (clickedOverlay.parentName === "Climate projections (Euro-CORDEX)" &&
      clickedOverlay.name === "Administrative rayons") ||
    (clickedOverlay.parentName === "Climate projections (Euro-CORDEX)" &&
      clickedOverlay.name === "Territorial communities") ||
    (clickedOverlay.parentName === "Climate projections (Euro-CORDEX)" &&
      clickedOverlay.name === "Ukraine") ||
    (clickedOverlay.parentName === "Historical observations" &&
      clickedOverlay.name === "Ukraine (1881-2020)")
  ) {
    return {
      active: {
        weight: 4,
        color: "#dce653",
        // interactive: true
        // bubblingMouseEvents: false,
        // smoothFactor: 2.0
      },
      passive: {
        dashArray: 1,
        fillOpacity: 0.9,
        color: "rgb(57, 61, 63)",
        weight: 2,
        // interactive: true
        // bubblingMouseEvents: false,
        // smoothFactor: 2.0
      },
      whileLoading: {
        dashArray: 1,
        fillOpacity: 0.9,
        color: "rgb(57, 61, 63)",
        weight: 2,
        interactive: false,
      },
      afterLoading: {
        interactive: true,
      },
    };
  }
  // if (
  //   clickedOverlay.parentName === "Historical observations" &&
  //   clickedOverlay.name === "Ukraine (1881-2020)"
  // ) {
  //   return {
  //     active: {
  //       weight: 4,
  //       fillColor: "rgba(57, 61, 63, 0.4)",
  //       color: "#dce653"
  //     },
  //     passive: {
  //       fillColor: "rgba(98, 146, 158, 0)",
  //       color: "rgb(57, 61, 63)",
  //       weight: 2
  //     }
  //   };
  // }
  if (
    clickedOverlay.parentName === "Base layers" &&
    clickedOverlay.name === "River basins"
  ) {
    return {
      active: {
        weight: 4,
        color: "#dce653",
      },
      passive: {
        fillOpacity: 0,
        interactive: true,
        className: "uaBasins-polygon",
        color: "rgb(57, 61, 63)",
        weight: 4,
      },
    };
  }
  throw new Error("Overlay is not found (getGaugeMarkerStyle)");
}
function findAccessType(clickedOverlay, currentMode, currentOption) {
  let currentAccessMode;
  let currentAccessOption;
  let chartOption;
  const chartMode = chartModes.find(
    (mode) => checkMode([clickedOverlay], mode, currentOption)
    // eslint-disable-next-line
  );
  if (chartMode) {
    return {
      chartMode,
      chartOption: currentOption,
      currentAccessMode: null,
      currentAccessOption: null,
    };
  }
  chartOption = chartOptions.find(
    (option) => checkOption([clickedOverlay], option, currentMode)
    // eslint-disable-next-line
  );
  if (chartOption) {
    return {
      chartMode: currentMode,
      chartOption,
      currentAccessMode: null,
      currentAccessOption: null,
    };
  }
  chartModes.forEach((mode) => {
    chartOptions.forEach((option) => {
      chartOption = checkOption([clickedOverlay], option, mode);
      currentAccessOption =
        chartOption && !currentAccessOption ? option : currentAccessOption;
      currentAccessMode =
        chartOption && !currentAccessMode ? mode : currentAccessMode;
    });
  });
  return {
    chartMode: null,
    chartOption: null,
    currentAccessMode,
    currentAccessOption,
  };
}
function findAllAccessTypes(clickedOverlay) {
  const allAccessTypes = [];
  chartModes.forEach((mode) => {
    chartOptions.forEach((option) => {
      const chartOpt = checkOption([clickedOverlay], option, mode);
      if (chartOpt) {
        allAccessTypes.push({ mode, option });
      }
    });
  });
  return allAccessTypes;
}
function checkOverlaysSelectedOption(
  currentSelectedOption,
  dynamicOverlayLayers
) {
  let KyivvodokanalShow = false;
  let Kyivvodokanal = { name: null, parentName: null };
  const WaterChemistry = dynamicOverlayLayers.find(
    (over) =>
      over.parentName === "Observations" && over.name === "Water chemistry"
  );
  if (WaterChemistry) {
    Kyivvodokanal = WaterChemistry.overlayNames.find(
      (over) => over.name === "Kyivvodokanal gauge"
    );
    if (currentSelectedOption) {
      if (
        currentSelectedOption.name === "Permanganate index" &&
        currentSelectedOption.unit === ", mgO/dm³"
      ) {
        if (Kyivvodokanal) {
          KyivvodokanalShow = true;
        }
      }
    }
  }
  return [
    {
      show: KyivvodokanalShow,
      name: Kyivvodokanal.name,
      parentName: "Water chemistry",
    },
  ];
}
function getDefaultGaugeName(gauge) {
  if (
    gauge.overlay.parentName === "Discharge" &&
    gauge.overlay.name === "Ukrainian gauges"
  ) {
    return `${gauge.riverEng} - ${gauge.nameEng}`;
  }
  if (
    gauge.overlay.parentName === "Water chemistry" &&
    gauge.overlay.name === "Hydromet network"
  ) {
    return `${gauge.basinUkr} - ${gauge.nameUkr} (${gauge.placeUkr})`;
  }
  if (
    gauge.overlay.parentName === "Water chemistry" &&
    gauge.overlay.name === "Kyivvodokanal gauge"
  ) {
    return `${gauge.basinUkr} - ${gauge.nameUkr}`;
  }
  if (
    gauge.overlay.parentName === "Climate projections (Euro-CORDEX)" &&
    gauge.overlay.name === "grid 0.11x0.11°"
  ) {
    return `Latitude: ${gauge.lat}, Longitude: ${gauge.lon}`;
  }
  if (
    gauge.overlay.parentName === "Climate projections (Euro-CORDEX)" &&
    gauge.overlay.name === "Administrative oblasts"
  ) {
    return gauge.nameEng.substr(-3) === "ska" ||
      gauge.nameEng.substr(-3) === "zka"
      ? `${gauge.nameEng} Oblast`
      : `${gauge.nameEng}`;
  }
  if (
    (gauge.overlay.parentName === "Climate projections (Euro-CORDEX)" &&
      gauge.overlay.name === "Administrative rayons") ||
    (gauge.overlay.parentName === "Climate projections (Euro-CORDEX)" &&
      gauge.overlay.name === "Ukraine") ||
    (gauge.overlay.parentName === "Historical observations" &&
      gauge.overlay.name === "Meteorological stations (1881-2020)") ||
    (gauge.overlay.parentName === "Historical observations" &&
      gauge.overlay.name === "Ukraine (1881-2020)")
  ) {
    return gauge.nameEng;
  }
  if (
    gauge.overlay.parentName === "Climate projections (Euro-CORDEX)" &&
    gauge.overlay.name === "River basins"
  ) {
    return gauge.subbasin
      ? `${gauge.basin} - ${gauge.subbasin}`
      : `${gauge.basin}`;
  }
  throw new Error("Overlay is not found (getDefaultGaugeName)");
}
function getServerParams(gauge) {
  if (
    gauge.overlay.parentName === "Historical observations" &&
    gauge.overlay.name === "Ukraine (1881-2020)"
  ) {
    return {
      kind: "Ukraine",
      place: "Ukraine",
      type: "historical_observations",
    };
  }
  if (
    gauge.overlay.parentName === "Historical observations" &&
    gauge.overlay.name === "Meteorological stations (1881-2020)"
  ) {
    return {
      rcp: ["rcp45", "rcp85"],
      kind: "meteostations",
      place: gauge.nameEng,
      type: "historical_observations",
    };
  }
  if (
    gauge.overlay.parentName === "Climate projections (Euro-CORDEX)" &&
    gauge.overlay.name === "grid 0.11x0.11°"
  ) {
    return {
      rcp: ["rcp45", "rcp85"],
      kind: "nodes",
      place: gauge.id,
      type: "projections",
    };
  }
  if (
    gauge.overlay.parentName === "Climate projections (Euro-CORDEX)" &&
    gauge.overlay.name === "Ukraine"
  ) {
    return {
      rcp: ["rcp45", "rcp85"],
      kind: "Ukraine",
      place: gauge.nameEng,
      type: "projections",
    };
  }
  if (
    gauge.overlay.parentName === "Climate projections (Euro-CORDEX)" &&
    gauge.overlay.name === "Administrative oblasts"
  ) {
    return {
      rcp: ["rcp45", "rcp85"],
      kind: "oblasts",
      place: gauge.nameEng,
      type: "projections",
    };
  }
  if (
    gauge.overlay.parentName === "Climate projections (Euro-CORDEX)" &&
    gauge.overlay.name === "Administrative rayons"
  ) {
    return {
      rcp: ["rcp45", "rcp85"],
      kind: "rayons",
      place: gauge.cod,
      type: "projections",
    };
  }
  if (
    gauge.overlay.parentName === "Climate projections (Euro-CORDEX)" &&
    gauge.overlay.name === "Territorial communities"
  ) {
    return {
      rcp: ["rcp45", "rcp85"],
      kind: "terhromads",
      place: gauge.cod,
      type: "projections",
    };
  }
  if (
    gauge.overlay.parentName === "Climate projections (Euro-CORDEX)" &&
    gauge.overlay.name === "River basins"
  ) {
    return {
      rcp: ["rcp45", "rcp85"],
      kind: "basins",
      place: gauge.subbasin || gauge.basin,
      type: "projections",
    };
  }
  throw new Error("Overlay is not found (getServerParams)");
}
function getLayerType(clickedOverlay) {
  if (
    (clickedOverlay.parentName === "Climate projections (Euro-CORDEX)" &&
      clickedOverlay.name === "grid 0.11x0.11°") ||
    (clickedOverlay.parentName === "Historical observations" &&
      clickedOverlay.name === "Meteorological stations (1881-2020)")
  ) {
    return "gauge";
  }
  if (
    (clickedOverlay.parentName === "Climate projections (Euro-CORDEX)" &&
      clickedOverlay.name === "Administrative oblasts") ||
    (clickedOverlay.parentName === "Climate projections (Euro-CORDEX)" &&
      clickedOverlay.name === "River basins") ||
    (clickedOverlay.parentName === "Climate projections (Euro-CORDEX)" &&
      clickedOverlay.name === "Territorial communities") ||
    (clickedOverlay.parentName === "Climate projections (Euro-CORDEX)" &&
      clickedOverlay.name === "Administrative rayons") ||
    (clickedOverlay.parentName === "Climate projections (Euro-CORDEX)" &&
      clickedOverlay.name === "Ukraine") ||
    (clickedOverlay.parentName === "Historical observations" &&
      clickedOverlay.name === "Ukraine (1881-2020)")
  ) {
    return "clicked-polygon";
  }
  if (
    clickedOverlay.parentName === "Base layers" &&
    clickedOverlay.name === "River basins"
  ) {
    return "polygon";
  }
  throw new Error("Overlay is not found (getLayerType)");
}
module.exports = {
  checkMode,
  checkOption,
  findGauge,
  filterGauge,
  getGaugeObj,
  getGaugeMarkerStyle,
  findAccessType,
  findAllAccessTypes,
  checkOverlaysSelectedOption,
  findGaugeByGauge,
  getDefaultGaugeName,
  getDefaultItemName,
  findItemByItem,
  getServerParams,
  getLayerType,
};
