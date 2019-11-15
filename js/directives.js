const swipe = {    
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
}; 

const tap = {    
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
}; 
