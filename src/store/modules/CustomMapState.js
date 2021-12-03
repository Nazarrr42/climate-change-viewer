const state = {
  currentChosenDates: { from: null, to: null },
  currentClickedOverlayLayers: [],
};
const actions = {
  CHANGE_CURRENT_CHOSEN_DATES({ commit }, dateObj) {
    commit("CHANGE_CURRENT_CHOSEN_DATES", dateObj);
  },
  CHANGE_CURRENT_CHOSEN_FIRST_DATE({ commit }, fromDate) {
    commit("CHANGE_CURRENT_CHOSEN_FIRST_DATE", fromDate);
  },
  CHANGE_CURRENT_CHOSEN_LAST_DATE({ commit }, toDate) {
    commit("CHANGE_CURRENT_CHOSEN_LAST_DATE", toDate);
  },
  CHANGE_CURRENT_CLICKED_OVERLAY_LAYERS({ commit }, layer) {
    commit("CHANGE_CURRENT_CLICKED_OVERLAY_LAYERS", layer);
  },
};
const mutations = {
  CHANGE_CURRENT_CHOSEN_DATES(state, dateObj) {
    state.currentChosenDates.from = dateObj.from;
    state.currentChosenDates.to = dateObj.to;
  },
  CHANGE_CURRENT_CHOSEN_FIRST_DATE(state, fromDate) {
    state.currentChosenDates.from = fromDate;
  },
  CHANGE_CURRENT_CHOSEN_LAST_DATE(state, toDate) {
    state.currentChosenDates.to = toDate;
  },
  CHANGE_CURRENT_CLICKED_OVERLAY_LAYERS(state, layer) {
    state.currentClickedOverlayLayers = layer;
  },
};
const getters = {
  getFormattedChosenDates(state) {
    const currentDates = {};
    currentDates.from = new Date(state.currentChosenDates.from);
    currentDates.to = new Date(state.currentChosenDates.to);
    return {
      from: {
        year: currentDates.from.getFullYear(),
        month: currentDates.from.getMonth(),
        date: currentDates.from.getDate(),
        hour: currentDates.from.getHours(),
      },
      to: {
        year: currentDates.to.getFullYear(),
        month: currentDates.to.getMonth(),
        date: currentDates.to.getDate(),
        hour: currentDates.to.getHours(),
      },
    };
  },
  getChosenDates(state) {
    return state.currentChosenDates;
  },
  getCurrentOverlayLayers(state) {
    return state.currentClickedOverlayLayers;
  },
};

export default {
  state,
  actions,
  mutations,
  getters,
};
