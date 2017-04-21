const Debouncer = {
  create: ({onStart, onShedule, onEnd, delayTime}) => {
    let timer = null;
    let bindedOnStart = null;
    let bindedOnShedule = null;
    let bindedOnEnd = null;
    let firstRun = true;
    return function(param) {
      clearTimeout(timer);
      if (firstRun) {
        firstRun = false;
        bindedOnStart = onStart.bind(this);
        bindedOnShedule = onShedule.bind(this);
        bindedOnEnd = onEnd.bind(this);
      }
      bindedOnStart();
      timer = setTimeout(() => {
        bindedOnShedule(param);
        bindedOnEnd();
      }, delayTime);
    };
  },
};

const OneStepDebouncer = {
  create: (callback, delayTime) => {
    const emptyFunction = () => null;
    return Debouncer.create({
      onStart: emptyFunction,
      onShedule: callback,
      onEnd: emptyFunction,
      delayTime: delayTime,
    });
  },
};
