import { SET_STATE, setState } from '@/store/helpers';

export default {
    namespaced: true,
    state: {
        events: [],
        currentIndex: 0,
    },

    getters: {
        events: state => state.events.sort((a,b) => a.parentNode - b.parentNode),
        eventById: state => id => {
            return state.events.find(x => x.index == id);
        },
        mainEvent: state => state.events.find(x => x.parentNode == -1),
        mainEvents: state => state.events.filter(x=>x.isEvent),
        initEvents: state => state.events.filter(x=>!x.isEvent).sort((x,y) => x.index - y.index),
        currentIndex: state => state.currentIndex
    },

    mutations: {
        SET_STATE,
        ADD_EVENT(state, payload) {
            state.events.push(payload);
            let parent = state.events.find(x=>x.index == payload.parentNode);
            if(parent){
                parent.childNodes.push(payload);
            }
            state.currentIndex++;
        },
        REMOVE_EVENT(state, index) {
            let event = state.events[index];
            let childNodes = state.events.filter(x=> x.parentNode == event.index);
            for(let i=0; i<childNodes.length; i++){
                let index = state.events.indexOf(childNodes[i]);
                state.events.splice(index, 1);
            }
            state.events.splice(index,1);
        },
        CLEAR_STATE(state){
            state.events = [];
            state.currentIndex = 0;
        },
        CLEAR_COMBINATIONS(state){
            for(let i=0; i<state.events.length; i++){
                state.events[i].combinations = [];
            }
        },
        LOAD_EVENTS(state, payload){
            state.events = payload;
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
