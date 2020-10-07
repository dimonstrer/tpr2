import Vue from 'vue';
import Vuex from 'vuex';
import States from './States/index';


Vue.use(Vuex);

let store = new Vuex.Store({
    modules: {
        States
    }
});

export default store;
