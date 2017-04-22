const decToBinDigitsList = (number) => {
  return number
    .toString(2)
    .split('')
    .map((digit) => +digit);    
};
const binDigitsListToDec = (binArray) => {
  return parseInt(binArray.join(''), 2);
};
const leadToLength = (array, length) => {
  for (let i = 0; i < length; i++) array.unshift(0);
};

const RestrictedSummator = (function() {

const RestrictedSummator = Object.create(Summator);
RestrictedSummator.create = function(params) {
  const self = Object.create(this);
  this.init(self, Object.create(params));
  return self;
};
RestrictedSummator.init = function(self, params) {
  const {maxValue, startValue} = params;
  if (maxValue <= startValue) {
    throw new Error('Wrong maxValue');
  }

  self.maxPossibleState = decToBinDigitsList(maxValue);
  self.initialState = decToBinDigitsList(startValue);
  const zerosToAdd = self.maxPossibleState.length - self.initialState.length;
  leadToLength(self.initialState, zerosToAdd);

  const triggers = self.maxPossibleState.map((digit, index) => {
    const initiallyActive = !!self.initialState[index];
    const trigger = Trigger.create();
    if (initiallyActive) trigger.next();
    return trigger;
  });
  Summator.init(self, triggers);
  self.SummatorAdd = self.add;
  self.add = (callbacks = {}) => {
    const preFired = callbacks.preFired ? callbacks.preFired : () => null;
    const onFired = callbacks.onFired ? callbacks.onFired : () => null;
    const currentValue = binDigitsListToDec(self.SummatorAdd());
    if (currentValue >= maxValue) {
      self.reset();
      onFired(currentValue);
    } else {
      preFired(currentValue);
    }
    return self.getState();
  };
};

return RestrictedSummator;
})();

const getCurrentTime = () => {
  const timeStorage = new Date();
  return {
    hours: timeStorage.getHours(),
    minutes: timeStorage.getMinutes(),
    seconds: timeStorage.getSeconds(),
  };
};

const initialTime = getCurrentTime();

const binaryClock = {
  secondClock: RestrictedSummator.create({
    maxValue: 60,
    startValue: initialTime.seconds,
  }),
  minuteClock: RestrictedSummator.create({
    maxValue: 60,
    startValue: initialTime.minutes,
  }),
  hourClock: RestrictedSummator.create({
    maxValue: 24,
    startValue: initialTime.hours,
  }),
  timer: null,
};

const BinaryClock = new Vue({
  el: '#clock',
  data() {
    return binaryClock;
  },
  computed: {
    seconds() {
      return binDigitsListToDec(this.secondClock.state);
    },
    minutes() {
      return binDigitsListToDec(this.minuteClock.state);
    }, 
    hours() {
      return binDigitsListToDec(this.hourClock.state);
    }
  },
  created() {
    const makeID = (trigger) => trigger.id = Math.random();
    this.secondClock.getTriggers().forEach(makeID);
    this.minuteClock.getTriggers().forEach(makeID);
    this.hourClock.getTriggers().forEach(makeID);
  },
  mounted() {
    const minuteClockFired = {
      onFired: () => {
        this.hourClock.add();
      }      
    };
    const secondClockFired = {
      onFired: () => {
        this.minuteClock.add(minuteClockFired);
      }      
    };
    this.timer = setInterval(() => {
      this.secondClock.add(secondClockFired);
    }, 1000);
  }
});