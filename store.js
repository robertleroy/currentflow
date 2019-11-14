
// import Vue from 'vue';
// import Vuex from 'vuex';

// Vue.use(Vuex);

// import { States } from "./js/states";


const Version = "0.0.1";
 
const store = new Vuex.Store({
  state: {
		version: "",
    states: [
      { name: 'Alabama', abbr: 'al', short: 'Al' },
      { name: 'Alaska', abbr: 'ak', short: 'Ak' },
      { name: 'Arizona', abbr: 'az', short: 'Ariz' },
      { name: 'Arkansas', abbr: 'ar', short: 'Ar' },
      { name: 'California', abbr: 'ca', short: 'Ca' },
      { name: 'Colorado', abbr: 'co', short: 'Co' },
      { name: 'Connecticut', abbr: 'ct', short: 'Ct' },
      { name: 'Delaware', abbr: 'de', short: 'Del' },
      { name: 'Florida', abbr: 'fl', short: 'Fla' },
      { name: 'Georgia', abbr: 'ga', short: 'Ga' },
      { name: 'Hawaii', abbr: 'hi', short: 'Hi' },
      { name: 'Idaho', abbr: 'id', short: 'Id' },
      { name: 'Illinois', abbr: 'il', short: 'Ill' },
      { name: 'Indiana', abbr: 'in', short: 'In' },
      { name: 'Iowa', abbr: 'ia', short: 'Iowa' },
      { name: 'Kansas', abbr: 'ks', short: 'Ks' },
      { name: 'Kentucky', abbr: 'ky', short: 'Ky' },
      { name: 'Louisiana', abbr: 'la', short: 'La' },
      { name: 'Maine', abbr: 'me', short: 'Me' },
      { name: 'Maryland', abbr: 'md', short: 'Md' },
      { name: 'Massachusetts', abbr: 'ma', short: 'Mass' },
      { name: 'Michigan', abbr: 'mi', short: 'Mich' },
      { name: 'Minnesota', abbr: 'mn', short: 'Minn' },
      { name: 'Mississippi', abbr: 'ms', short: 'Miss' },
      { name: 'Missouri', abbr: 'mo', short: 'Mo' },
      { name: 'Montana', abbr: 'mt', short: 'Mont' },
      { name: 'Nebraska', abbr: 'ne', short: 'Ne' },
      { name: 'Nevada', abbr: 'nv', short: 'Nv' },
      { name: 'New Hampshire', abbr: 'nh', short: 'NH' },
      { name: 'New Jersey', abbr: 'nj', short: 'NJ' },
      { name: 'New Mexico', abbr: 'nm', short: 'NM' },
      { name: 'New York', abbr: 'ny', short: 'NY' },
      { name: 'North Carolina', abbr: 'nc', short: 'NC' },
      { name: 'North Dakota', abbr: 'nd', short: 'ND' },
      { name: 'Ohio', abbr: 'oh', short: 'Oh' },
      { name: 'Oklahoma', abbr: 'ok', short: 'Ok' },
      { name: 'Oregon', abbr: 'or', short: 'Or' },
      { name: 'Pennsylvania', abbr: 'pa', short: 'Pa' },
      { name: 'Rhode Island', abbr: 'ri', short: 'RI' },
      { name: 'South Carolina', abbr: 'sc', short: 'SC' },
      { name: 'South Dakota', abbr: 'sd', short: 'SD' },
      { name: 'Tennessee', abbr: 'tn', short: 'Tenn' },
      { name: 'Texas', abbr: 'tx', short: 'Tx' },
      { name: 'Utah', abbr: 'ut', short: 'Utah' },
      { name: 'Vermont', abbr: 'vt', short: 'Vt' },
      { name: 'Virginia', abbr: 'va', short: 'Va' },
      { name: 'Washington', abbr: 'wa', short: 'Wash' },
      { name: 'West Virginia', abbr: 'wv', short: 'WV' },
      { name: 'Wisconsin', abbr: 'wi', short: 'Wis' },
      { name: 'Wyoming', abbr: 'wy', short: 'Wyo' }
    ],
    favorites: ['09380000'],  
    favsObj: { 
      name: 'Favorites', 
      abbr: 'favs', 
      short: 'Favs' 
    },  
    selectedState: null,
    graphPeriod: 7,
  },
  
  getters: {    
    favorites: state => {
      return state.favorites; 
    },

    states: state => {
      let list = [...state.states];
      
      if (state.favorites.length) {        
        list.unshift(state.favsObj);
      }
      
      return list;
    },
    
    selectedState: state => {
      // console.log(typeof(state.selectedState), state.selectedState);
      if (!state.selectedState) {
        return { name: 'Colorado', abbr: 'co', short: 'Co' }
      } else {        
        return state.selectedState;
      }      
    } 
  },
  
  mutations: {  

    initializeStore(state) {
      if ( localStorage.getItem('store') ) {
        let store = JSON.parse( 
          localStorage.getItem('store') 
        );

        if ( store.version === Version ) {
					// this.replaceState(store);
					state.favorites = store.favorites;
					state.version = store.version;
					state.graphPeriod = store.graphPeriod
					state.selectedState = store.selectedState;  
        } else {
          state.version = Version;
        }
      }      
    },


    addFavorite (state, payload) {
      state.favorites.push(payload);
    },

    deleteFavorite (state, payload) {
      state.favorites = state.favorites.filter(x => x !== payload)
    },

    setSelectedState (state, payload) {
      state.selectedState = payload;
    },

    updateGraphPeriod (state, payload) {
      state.graphPeriod = payload;
    },

    setVersion (state, payload) {
      state.version = payload;
    }
  },

  actions: {
    addFavAsync ({commit}, payload) {
      commit("addFavorite", payload);
    },

    deleteFavAsync ({commit}, payload) {
      commit("deleteFavorite", payload);
    },
  }
})
