const state = {
  currentAccordionItem: null,
  currentSelectedOption: null,
  currentChildOverlays: [] /* { name: 'Discharge', unit: ", m³/s" } */,
};
const actions = {
  CHANGE_CURRENT_ACCORDION_ITEM({ commit }, name) {
    commit("CHANGE_CURRENT_ACCORDION_ITEM", name);
  },
  CHANGE_CURRENT_SELECTED_OPTION({ commit }, option) {
    commit("CHANGE_CURRENT_SELECTED_OPTION", option);
  },
  CHANGE_CURRENT_CHILD_OVERLAYS({ commit }, childOverlays) {
    commit("CHANGE_CURRENT_CHILD_OVERLAYS", childOverlays);
  },
  RESET_CURRENT_CHILD_OVERLAYS({ commit }) {
    commit("RESET_CURRENT_CHILD_OVERLAYS");
  },
  REMOVE_OVERLAY_FROM_CURRENT_CHILD_OVERLAYS({ commit }, overlay) {
    commit("REMOVE_OVERLAY_FROM_CURRENT_CHILD_OVERLAYS", overlay);
  },
};
const mutations = {
  CHANGE_CURRENT_ACCORDION_ITEM(state, name) {
    state.currentActiveItem = name;
  },
  CHANGE_CURRENT_SELECTED_OPTION(state, option) {
    state.currentSelectedOption = option;
  },
  CHANGE_CURRENT_CHILD_OVERLAYS(state, childOverlays) {
    state.currentChildOverlays = [...childOverlays];
  },
  REMOVE_OVERLAY_FROM_CURRENT_CHILD_OVERLAYS(state, overlay) {
    state.currentChildOverlays = state.currentChildOverlays.filter(
      (over) =>
        !(
          overlay.name === over.name &&
          overlay.parentName === over.parentName &&
          overlay.overlayNames.length === over.overlayNames.length &&
          over.defaultOverlayNames.length ===
            overlay.defaultOverlayNames.length &&
          over.realLabel === overlay.realLabel
        )
    );
  },
  RESET_CURRENT_CHILD_OVERLAYS(state) {
    state.currentChildOverlays = [];
  },
};
const getters = {
  getCurrentSelectedOption(state) {
    return state.currentSelectedOption;
  },
  getCurrentSelectedOptionTitle(state) {
    return state.currentSelectedOption.name + state.currentSelectedOption.unit;
  },
  getCurrentChildOvelrays(state) {
    return state.currentChildOverlays;
  },
};

export default {
  state,
  actions,
  mutations,
  getters,
};
