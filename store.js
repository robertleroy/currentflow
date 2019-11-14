const store = new Vuex.Store({
  state: {
		version: "",
    states: States,
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

        if ( store.version == Version ) {          
            Object.assign(state, store);
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

