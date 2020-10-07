import { SET_STATE, setState } from '@/store/helpers';

export default {
    namespaced: true,
    state: {
        events: []
    },

    getters: {
        events: state => state.events.sort((a,b) => a.parentNode - b.parentNode),
        eventById: state => id => {
            return state.events.find(x => x.index == id);
        },
        mainEvent: state => state.events.find(x => x.parentNode == -1)
    },

    mutations: {
        SET_STATE,
        ADD_EVENT(state, payload) {
            state.events.push(payload);
            let parent = state.events.find(x=>x.index == payload.parentNode);
            if(parent){
                parent.childNodes.push(payload);
            }

        },
        REMOVE_EVENT(state, index) {
            let event = state.events.find(x =>x.index == index);
            let parent = state.events.find(x => x.index == event.parentNode);
            if(parent){
                let eventId = parent.childNodes.indexOf(event);
                parent.childNodes.splice(eventId, 1);
            }

            state.events.splice(index,1);
        },
        CLEAR_STATE(state){
            state.events = [];
        }
    },

    actions: {
        async fetchItems({ commit }) {
            try {
                setState(commit, { loading: true });
            } catch (error) {
                if (!error?.data?.errorMessage) {
                    console.log(error)
                }
            } finally {
                setState(commit, { loading: false });
            }
        }
    }
};
