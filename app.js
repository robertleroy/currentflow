// app.js //

import './style.scss';

import Vue from 'vue';
import Vuex from 'vuex';
import { version, statesObj } from './config.json';

Vue.use(Vuex);



// #region Pipes ======================== //
Vue.filter('date', function (value, format) {
  if (!value) return '';
  return moment(String(value)).format(format);
});

Vue.filter('titlecase', function (value) {
  if (!value) return '';
  value = value.toString().toLowerCase()  ;
   return value.replace(/(^|\s)\S/g, function(t) { return t.toUpperCase() });
});

Vue.filter('decimal', function (value, d=0) {
  if (!value) return '' ;
  value = value * 1;
  return value.toFixed(d);
});
// #endregion Pipes ======================== //
  


// #region Store ======================== //
const store = new Vuex.Store({
  state: {
    version: '',
    favorites: ['09058000'],  
    favsObj: { 
      name: 'Favorites', 
      abbr: 'favs', 
      short: 'Favs' 
    }, 
    states: [],
    selectedState: null,
    graphPeriod: 7,
  },
 
  getters: {
    favorites: state => {
      return state.favorites; 
    },

    states: state => {
      let statesDisplay = [...state.states];
      
      if (state.favorites.length) {        
        statesDisplay.unshift(state.favsObj);
      }
      
      return statesDisplay;
    },

    selectedState: state => {
      if (state.selectedState) {
        return state.selectedState;
      } else {
        return { name: 'Colorado', abbr: 'co', short: 'Co' }
      }      
    }
    
  },

  mutations: {
    initializeStore(state) {
			if ( localStorage.getItem('store') ) {
        let store = JSON.parse( localStorage.getItem('store') );

        if ( store.version === version ) {
          this.replaceState(
            Object.assign(state, store)
          );
        } else {
          state.version = version;
        }
			}
		},

    addFavorite (state, payload) {
      state.favorites.push(payload);
      console.log(payload);
    },

    deleteFavorite (state, payload) {
      state.favorites = state.favorites.filter(x => x !== payload)
    },

    setStates (state, payload) {
      state.states = payload;
    },

    setSelectedState (state, payload) {
      state.selectedState = payload;
    },

    updateGraphPeriod (state, payload) {
      state.graphPeriod = payload;
    }
  },

  actions: {
    addFavAsync ({commit}, payload) {
      console.log(payload);
      commit("addFavorite", payload);
    },

    deleteFavAsync ({commit}, payload) {
      commit("deleteFavorite", payload);
    },

    setStatesAsync ({commit}, payload) {
      commit("setStates", payload);
    }
  }
})

import { 
  mapState, 
  mapGetters,
  mapMutations, 
  mapActions 
} from 'vuex';
// #endregion Store ======================== //



const app = new Vue({ 
  el: '#app', 
  store,

  data: {
    title: 'Currentflow',
    placeholder: "filter...",
    filter: '',

    showStates: false,
    showDetail: false,
    toggleAbout: false,
    toggleFade: false,

    guages: [],
    selectedGuage: {},
    periods: [
      { num: 1, name: '1 days' },
      { num: 7, name: '7 days' },
      { num: 30, name: '30 days' },
      { num: 90, name: '90 days' }
    ],
  },

  computed: {
    ...mapState([
      'version',
    ]),
    ...mapGetters([
      'favorites',
      'states',
      'selectedState',
    ]),

    graphPeriod: {
      get () {
        return this.$store.state.graphPeriod;
      },
      set (value) {
        this.$store.commit('updateGraphPeriod', value)
      }
    },

    filteredGuages: function() {
      if (!this.filter) {
        return this.guages;
      } else {
        return this.guages.filter(guage =>
          guage.siteName.toLowerCase().indexOf(this.filter.toLowerCase()) !== -1);
      }
    },
  },

  methods: {  
    ...mapMutations([
      "setSelectedState",
    ]),

    ...mapActions([
      'addFavAsync',
      'deleteFavAsync',
      'setStatesAsync'
    ]), 

     
    // #region States ================ //
    getStates() {         
      this.setStatesAsync(statesObj); 
    },

    toggleStates() {
      if (window.innerWidth < 800) {
        this.showStates = !this.showStates;
        if (this.showStates) {
          this.$refs.aside.style.transform = "translate(0)";
          this.$refs.guages.style.marginLeft = "100vw";
        } else {
          this.$refs.aside.style.transform = "translate(-100vw)";
          this.$refs.guages.style.marginLeft = "0";
        }
      } 
    },

    selectState(state) {
      this.setSelectedState(state);
      this.toggleStates();
      this.loadGuages(state.abbr);
    },
    // #endregion States ================ //

    
    // #region Guages ================ //
    async loadGuages(abbr) {      
      // this.guages = [];
      this.toggleFade = !this.toggleFade;
      this.filter = "";

      const prefixUrl = 'https://waterservices.usgs.gov/nwis/iv/?format=json&';
      const suffixUrl = '&modifiedSince=PT2H&parameterCd=00060&siteStatus=active';

      if ( abbr === "favs" ) {
        if (this.favorites.length) {
          abbr = '&sites=' + this.favorites.toString();
        } else { 
          console.log('No Favorites Stored');          
          return;
        }
      } else {
        abbr = 'stateCd=' + abbr;
      }
      
      let response = await fetch(prefixUrl + abbr + suffixUrl);
      let data = await response.json();
      let timeSeries = data.value.timeSeries
      this.guages = timeSeries.map(guage => {
        let obj = {
          siteName: guage.sourceInfo.siteName,
          value: "-999998",
          dateTime: "1970-01-01T00:00:00.000Z",
          siteCode: guage.sourceInfo.siteCode[0].value,
          latitude: guage.sourceInfo.geoLocation.geogLocation.latitude,
          longitude: guage.sourceInfo.geoLocation.geogLocation.longitude,
          isFavorite: this.favorites.includes(guage.sourceInfo.siteCode[0].value)
        }

        /* Compensate for error with California
        Colorado River Below Imperial Dam, Az-ca
        value & dateTime */
         if (!guage.values[0].value[0]) {
           return obj;
         };
         
          obj.value = guage.values[0].value[0].value;
          obj.dateTime = guage.values[0].value[0].dateTime;

        return obj;      
      });      
    },    
    // #endregion Guages ================ //


    // #region Detail ================ //
    toggleDetail(guage) {
      this.selectedGuage = guage;
      this.showDetail = !this.showDetail;      
    },
    
    toggleFav(guage) {
      console.log(guage.isFavorite);
      if (guage.isFavorite) {
        this.deleteFavAsync(guage.siteCode);
      } else {
        this.addFavAsync(guage.siteCode);
      }
      guage.isFavorite = !guage.isFavorite;
    },
    // #endregion Detail ================ //


    // #region Utility ================ //
    innerWidth() {
      return window.innerWidth;
    },

    clearFilter() {
      this.filter = "";
      this.$refs.filter.focus();
    },
    // #endregion Utility ================ //
  },    

  beforeCreate() {
		this.$store.commit('initializeStore');
    this.$store.subscribe((mutation, state) => {
      localStorage.setItem('store', JSON.stringify(state));
    });
	},
  
  mounted() {
    this.getStates(); 
    this.loadGuages(this.selectedState.abbr);
  }

});




