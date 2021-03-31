import Vue from 'vue';
import * as types from '../mutation-types';
import ContactAPI from '../../api/contacts';
import ConversationApi from '../../api/conversations';

const state = {
  records: {},
  uiFlags: {
    isFetching: false,
  },
};

export const getters = {
  getUIFlags($state) {
    return $state.uiFlags;
  },
  getContactConversation: $state => id => {
    return $state.records[Number(id)] || [];
  },
};

export const actions = {
  create: async ({ commit }, { inboxId, message }) => {
    commit(types.default.SET_CONTACT_CONVERSATIONS_UI_FLAG, {
      isCreating: true,
    });
    try {
      // const response =
      await ConversationApi.create({
        inbox_id: inboxId,
        message,
      });
      // commit(types.default.SET_CONTACT_CONVERSATIONS, {
      //   id: contactId,
      //   data: response.data.payload,
      // });
      // commit(types.default.SET_ALL_CONVERSATION, response.data.payload, {
      //   root: true,
      // });
      commit(types.default.SET_CONTACT_CONVERSATIONS_UI_FLAG, {
        isCreating: false,
      });
    } catch (error) {
      commit(types.default.SET_CONTACT_CONVERSATIONS_UI_FLAG, {
        isCreating: false,
      });
    }
  },
  get: async ({ commit }, contactId) => {
    commit(types.default.SET_CONTACT_CONVERSATIONS_UI_FLAG, {
      isFetching: true,
    });
    try {
      const response = await ContactAPI.getConversations(contactId);
      commit(types.default.SET_CONTACT_CONVERSATIONS, {
        id: contactId,
        data: response.data.payload,
      });
      commit(types.default.SET_ALL_CONVERSATION, response.data.payload, {
        root: true,
      });
      commit(types.default.SET_CONTACT_CONVERSATIONS_UI_FLAG, {
        isFetching: false,
      });
    } catch (error) {
      commit(types.default.SET_CONTACT_CONVERSATIONS_UI_FLAG, {
        isFetching: false,
      });
    }
  },
};

export const mutations = {
  [types.default.SET_CONTACT_CONVERSATIONS_UI_FLAG]($state, data) {
    $state.uiFlags = {
      ...$state.uiFlags,
      ...data,
    };
  },
  [types.default.SET_CONTACT_CONVERSATIONS]: ($state, { id, data }) => {
    Vue.set($state.records, id, data);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
