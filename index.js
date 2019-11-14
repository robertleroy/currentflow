// app.js //

Vue.directive( "swipe", {    
  bind: function(el, binding) {    
    
    if (typeof binding.value === "function") { 
      const mc = new Hammer(el); 

    let argDirection;
    binding.arg === "right" ? argDirection = Hammer.DIRECTION_RIGHT :
    binding.arg === "left" ? argDirection = Hammer.DIRECTION_LEFT :
    argDirection = Hammer.DIRECTION_HORIZONTAL;

      mc.get("swipe").set({ direction: argDirection });
      mc.on("swipe", binding.value);
      /* 2=left 4=right */
    }
  }
}); 

Vue.directive( "tap", {    
  bind: function(el, binding) {    
    
    if (typeof binding.value === "function") { 
      const mc = new Hammer(el); 

    let argDirection;
    binding.arg === "right" ? argDirection = Hammer.DIRECTION_RIGHT :
    binding.arg === "left" ? argDirection = Hammer.DIRECTION_LEFT :
    argDirection = Hammer.DIRECTION_HORIZONTAL;

      // mc.get("tap").set({ direction: argDirection });
      mc.on("tap", binding.value);
      /* 2=left 4=right */

      console.log(binding.value);
    }
  }
});



const app = new Vue({ 
  el: '#app',
  store,
  filters: {
    "date": date,
  },
  data: {
    lorem: "lorem ipsum dolor sit amet consectetur",
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
    states: function() {
      return this.$store.getters.states;
    },
    dateNow() {
      const dtNow = new Date();
      return dtNow;
    }
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
      this.showDetail = !this.showDetail;
      
      // console.log(guage.siteName);
    },

    mainSwipe(e) {
      e.direction === 4 ? this.showStates = true : 
      this.showStates = false;
    },
  },

  mounted() {
    this.getSize()
    window.addEventListener("resize", this.getSize); 
  }
});

