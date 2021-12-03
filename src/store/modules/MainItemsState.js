const state = {
  currentActiveItem: "db-item",
};
const actions = {
  CHANGE_CURRENT_ACTIVE_ITEM({ commit }, name) {
    commit("CHANGE_CURRENT_ACTIVE_ITEM", name);
  },
};
const mutations = {
  CHANGE_CURRENT_ACTIVE_ITEM(state, name) {
    state.currentActiveItem = name;
  },
};

export default {
  state,
  actions,
  mutations,
};
