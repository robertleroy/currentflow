// app.js //





const app = new Vue({ 
  el: '#app',
  store,
  directives: {
    "swipe": swipe,
    "tap": tap
  },
  filters: {
    "date": date,
    "titlecase": titlecase,
    "decimal": decimal,
    "number": number
  },
  data: {
    title: "CurrentFlow",
    placeholder: "filter...",
    filter: '',

    innerWidth: 0,
    innerHeight: 0,

    showStates: false,
    showDetail: false,
    toggleAbout: false,
    toggleFade: false,
    loadingGuages: false,

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
    getSize() {
      this.innerWidth = window.innerWidth;
      this.innerHeight = window.innerHeight;
    },
    
    toggleStates() {
      this.showStates = !this.showStates;
    },

    toggleDetail(guage) {
      this.selectedGuage = guage;
      this.showDetail = !this.showDetail;      
    },
    
    toggleFav(guage) {
      // console.log(guage.isFavorite);
      if (guage.isFavorite) {
        this.$store.dispatch('deleteFavAsync', guage.siteCode);
      } else {
		    this.$store.dispatch('addFavAsync', guage.siteCode);
        
      }
      guage.isFavorite = !guage.isFavorite;
    },

    mainSwipe(e) {
      e.direction === 4 ? this.showStates = true : 
      this.showStates = false;
    },
    
    clearFilter() {
      this.filter = "";
      this.$refs.filter.focus();
    },

    selectState(state) {
      this.$store.commit("setSelectedState", state);
      this.toggleStates();
      this.loadGuages(state.abbr);
      // console.log(state);
    },

    // #region Guages ================ //
    async loadGuages(abbr) {   
      this.loadingGuages = true;

      // console.log("loadGuages(abbr)", abbr); 
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
	    
      const favs = Array.from(this.favorites);
      
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
          isFavorite: favs.includes(guage.sourceInfo.siteCode[0].value)
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
      this.loadingGuages = false;
    },    
    // #endregion Guages ================ //
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
    this.getSize();
    window.addEventListener("resize", this.getSize); 

    this.loadGuages(this.selectedState.abbr);    
  },

  destroyed() {
    window.removeEventListener("resize", this.onResize);
  }
});
