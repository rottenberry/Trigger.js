/**
* Creates a domain of binary or decimal values by a given numeradic base
* @param string numeradicBase
* @return array domain
*/
const getDomain = (numeradicBase) => {
  let domain;
  switch(numeradicBase) {
    case 'dec' : domain = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]; break;
    case 'bin' :
    default : domain = [0, 1]; //bin by default
  }

  return domain;
};


/**
* A prototype, which creates triggers
*/
const Trigger = Object.create(null);
/**
* Creates a trigger with a given domain
* Doesn't use new keyword
* @param array domain
* @return object trigger
*/
Trigger.create = function createTrigger(domain) {
  let self = Object.create(this);
  this.init(self, domain);
  return self;
};
/**
* Initiates a trigger object given by Trigger.create();
* @param object trigger
* @param array domain ([0, 1]) by default
* 
*/
Trigger.init = function initTrigger(trigger, domain = getDomain()) {  
  /**
  * Shows if the trigger is turn on now
  */
  trigger.active = false;
  /**
  * Shows the position the trigger is on now
  */
  let pointer = 0;
  /**
  * Indicates that the trigger has been promoted early
  */
  let hasBeenPromoted = false;
  /**
  * Returns a copy of the trigger's domain
  * @return array domain
  */
  trigger.getDomain = () => domain.slice();
  /**
  * Returns the current trigger value
  * @return object state
  */
  trigger.getState = () => {
    let triggerCurrentValue = domain[pointer];
    return {value: triggerCurrentValue};
  };
  /**
  * Promotes the trigger to the next value in the domain;
  * If the trigger has reached the start value since the lastest trigger.next() call
  * state.fired will be equal true, else will be equal false
  * @return object state
  */
  trigger.next = () => {
    let fired = false;
    if (!hasBeenPromoted) {
      pointer = 0;
      hasBeenPromoted = true;
    } else if (pointer === domain.length - 1) {
      fired = true;
      pointer = -1; // for the next time trigger.next() will promote to 0
    }
    
    pointer += 1;
    let next = domain[pointer];
    trigger.active = !!next;
    return {value: next, fired: fired};
  };

  trigger.reset = () => {
    hasBeenPromoted = false;
    pointer = 0;
    trigger.active = false;
  };
};

/**
*The prototype creates a summator which is a containter for a bunch of triggers
* A summator can promote its triggers and call a callback when all triggers 
* will be promoted
*/
const Summator = Object.create(null);
/**
* Creates a summator object with given triggers
* @param array triggers
* @return object summator
*/
Summator.create = function createSummmator(triggers) {
  let self = Object.create(this);
  this.init(self, triggers);
  return self;
};
/**
* Initiates the summator
* @param object summator
* @param array triggers
*/
Summator.init = function initSummator(summator, triggers) { 
  /**
  * Returns state of each trigger
  * @return array states
  */
  summator.getState = () => {
    return triggers.map((trigger) => trigger.getState().value);
  };

  /**
  * Updates binary state of the summator
  */
  summator.updateState = () =>{
    summator.state = summator.getState();
  };

  /**
  * Returns triggers
  * @return array triggers
  */
  summator.getTriggers = function() {
    return triggers;
  };

  /**
  * Resets a summator
  */
  summator.reset = () => {
    triggers.forEach((trigger) => trigger.reset());
    summator.updateState();
  };

  /**
  * Promotes all triggers in the bunch. If the lastest trigger has been promoted
  * the summator calls the callback
  * @return array states
  */
  summator.add = (callback) => {
    let trigger = triggers.length;
    let hasCanceledAdding = false;
    while (trigger--) {
      let triggerData = triggers[trigger].next();
      if (!triggerData.fired) {
        hasCanceledAdding = true;
        break;
      }
    }
    if (!hasCanceledAdding && typeof callback === "function") {
      callback();
    }
    summator.updateState();
    return summator.getState();
  };

  summator.updateState();
};
