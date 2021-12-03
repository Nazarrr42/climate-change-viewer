function isElement(element) {
  return element instanceof Element || element instanceof HTMLDocument;
}
const state = {
  currentHiddenLegends: [],
};
const actions = {
  CHANGE_CURRENT_HIDDEN_LEGENDS({ commit }, hiddenLegends) {
    commit("CHANGE_CURRENT_ACCORDION_ITEM", hiddenLegends);
  },
};
const mutations = {
  CHANGE_CURRENT_HIDDEN_LEGENDS(state, hiddenLegends) {
    state.currentHiddenLegends = hiddenLegends;
  },
};
const getters = {
  getCurrentHiddenLegends(state) {
    if (false || !isElement(state.currentHiddenLegends[0])) {
      return state.currentHiddenLegends.slice(1);
    }
    return state.currentHiddenLegends;
  },
};

export default {
  state,
  actions,
  mutations,
  getters,
};
