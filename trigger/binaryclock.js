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
    milliseconds: timeStorage.getMilliseconds(),
  };
};

const initialTime = getCurrentTime();

const binaryClock = {
  millisecondClock: RestrictedSummator.create({
    maxValue: 1000,
    startValue: Math.round(initialTime.milliseconds),
  }),
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
};

const BinaryClock = new Vue({
  el: '#clock',
  data() {
    return binaryClock;
  },
  methods: {
    leadToOneZero(number) {
      if (number < 10) return "0" + number;
      return number;
    },
    leadToTwoZeros(number) {
      if (number < 10) return "00" + number;
      if (number < 100) return "0" + number;
      return number;
    }
  },
  computed: {
    milliseconds() {
      return this.leadToTwoZeros(
        binDigitsListToDec(this.millisecondClock.state)
      );
    },
    seconds() {
      return this.leadToOneZero(binDigitsListToDec(this.secondClock.state));
    },
    minutes() {
      return this.leadToOneZero(binDigitsListToDec(this.minuteClock.state));
    }, 
    hours() {
      return this.leadToOneZero(binDigitsListToDec(this.hourClock.state));
    }
  },
  created() {
    const makeID = (trigger) => trigger.id = Math.random();
    this.millisecondClock.getTriggers().forEach(makeID);
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
    const millisecondsClockFired = {
      onFired: () => {
        this.secondClock.add(secondClockFired);
      }
    };
    let lastRunMSeconds = Date.now();
    const runFrameLoop = () => {
        let currentRunMSecends = Date.now();
        let lag = Math.round((currentRunMSecends - lastRunMSeconds));
        for (let i = 0; i < lag; i++) {
          this.millisecondClock.add(millisecondsClockFired);
        }
        lastRunMSeconds = currentRunMSecends;
        requestAnimationFrame(runFrameLoop);
    };
    requestAnimationFrame(runFrameLoop);
  }
});
