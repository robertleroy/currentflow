// app.js //

const Version = "0.0.1";

Vue.directive("swipe_left", {    
  bind: function(el, binding) {
    if (typeof binding.value === "function") { 
      const mc = new Hammer(el); 
      mc.get("swipe").set({ direction: Hammer.DIRECTION_LEFT });
      mc.on("swipe", binding.value);
    }
  }
});  

Vue.directive("swipe_right", { 
  bind: function(el, binding) {
    if (typeof binding.value === "function") {
      const mc = new Hammer(el);
      mc.get("swipe").set({ direction: Hammer.DIRECTION_RIGHT });
      mc.on("swipe", binding.value);
    }
  }
});


// #region Pipes ======================== //
// Vue.filter('date', function (value, format) {
//   if (!value) return '';
//   return moment(String(value)).format(format);
// });

// Vue.filter('titlecase', function (value) {
//   if (!value) return '';
//   value = value.toString().toLowerCase()  ;
//    return value.replace(/(^|\s)\S/g, function(t) { return t.toUpperCase() });
// });

// Vue.filter('decimal', function (value, d=0) {
//   if (!value) return '' ;
//   value = value * 1;
//   return value.toFixed(d);
// });
// #endregion Pipes ======================== //
  


// #region Store ======================== //
const store = new Vuex.Store({
  state: {
    version: "",
    favorites: ['09380000'],  
    favsObj: { 
      name: 'Favorites', 
      abbr: 'favs', 
      short: 'Favs' 
    }, 
    statesList: [
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
    selectedState: null,
    graphPeriod: 7,
  },
 
  getters: {
    favorites: state => {
      return state.favorites; 
    },

    states: state => {
      let list = [...state.statesList];
      
      if (state.favorites.length) {        
        list.unshift(state.favsObj);
      }
      
      return list;
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
      console.log(payload);
    },

    deleteFavorite (state, payload) {
      state.favorites = state.favorites.filter(x => x !== payload)
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
  }
})

// #endregion Store ======================== //



const app = new Vue({ 
  el: '#app', 
  store,
  filters: {
    "titlecase": titlecase,
    "decimal": decimal,
    "date": date
  },

  data: {
    title: 'Currentflow',
    placeholder: "filter...",
    filter: '',
    innerWidth: 0,

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
    version () {
      return this.$store.state.version;
    },
    
    favorites () {
      return this.$store.getters.favorites;
    },
    
    states () {
      return this.$store.getters.states;
    },
    
    selectedState () {
      return this.$store.getters.selectedState;
    },

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
     
    // #region States ================ //

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
      this.$store.commit('setSelectedState', state);
      this.toggleStates();
      this.loadGuages(state.abbr);
    },
    // #endregion States ================ //

    
    // #region Guages ================ //
    async loadGuages(abbr) {      
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
          longitude: guage.sourceInfo.geoLocation.geogLocation.longitude,isFavorite: 
          this.favorites.includes(guage.sourceInfo.siteCode[0].value)
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
        this.$store.dispatch('deleteFavAsync', guage.siteCode);
      } else {
		    this.$store.dispatch('addFavAsync', guage.siteCode);
        
      }
      guage.isFavorite = !guage.isFavorite;
    },
    // #endregion Detail ================ //


    // #region Utility ================ //
    // innerWidth() {
    //   return window.innerWidth;
    // },
    
    onResize() {
      this.innerWidth = window.innerWidth;
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

      let store = {
        version: state.version,
        favorites: state.favorites,
        selectedState: state.selectedState,
        graphPeriod: state.graphPeriod,
      };
      localStorage.setItem(
        'store', JSON.stringify(store)
      );
    });
	},
  
  mounted() {
    this.loadGuages(this.selectedState.abbr);
    this.innerWidth = window.innerWidth;
    
    window.addEventListener("resize", this.onResize);
  },

  destroyed() {
    window.removeEventListener("resize", this.onResize);
  }

});
