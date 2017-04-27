Vue.component("trigger", {
  template: triggerTemplate.innerHTML,
  props: ["trigger"],
  data: function() {
    return this.trigger;
  },
});

Vue.component("summator", {
  props: ['env'],
  data: function() {
    const summator = Summator.create(this.env.triggers);
    summator.triggers = summator.getTriggers();
    summator.frame = {};
    summator.frame.run = true;
    summator.frame.timeout = 500;
    summator.frame.timeoutPointer = 4;
    summator.frame.timeouts = [
      50,
      100,
      250,
      500,
      1000,
      2000,
    ];
    return summator;
  },
  watch: {
    triggers: function() {
      this.updateState();
    },
    cantAddMore: function(newValue) {
      if (!newValue) {
        this.env.addLeftButton.setEnabledTitle();
        this.env.addRightButton.setEnabledTitle();
      } else {
        this.env.addLeftButton.setDisabledTitle();
        this.env.addRightButton.setDisabledTitle();
        this.env.Notification.showError(
          this.env.errorMessages['summator-full']
        );
      }
    }
  },
  computed: {
    cantSpeedUp: function() {
      return (this.frame.timeoutPointer - 1) < 0;
    },
    cantSlowDown: function() {
      return (this.frame.timeoutPointer) >= (this.frame.timeouts.length - 1);
    },
    sumValue: function() {
      if (this.state.length <= 0) return 0;
      return parseInt(this.state.join(""), 2);
    },
    cantAddMore: function() {
      return this.triggers.length >= this.env.params.MAX_SIZE;
    }
  },
  created: function() {
    this.currentAutoSumAction = null;
    this.$options.template = this.env.template;
    this.lastAddTime = Date.now();
    const summatorLoop = function() {
      if (!this.frame.run) return;

      const currentTime = Date.now();
      const delta = currentTime - this.lastAddTime;
      if (delta >= this.frame.timeout) {
        this.add();
        this.lastAddTime = currentTime;
      }

      requestAnimationFrame(this.summatorLoop);
    };
    this.summatorLoop = summatorLoop.bind(this);
  },
  methods: {
    speedUp: function() {
      if (this.cantSpeedUp) return;
      this.frame.timeoutPointer = this.frame.timeoutPointer - 1;
      this.frame.timeout = this.frame.timeouts[this.frame.timeoutPointer];
    },
    slowDown: function() {
      if (this.cantSlowDown) return;
      this.frame.timeoutPointer = this.frame.timeoutPointer +1;
      this.frame.timeout = this.frame.timeouts[this.frame.timeoutPointer];
    },
    createTriggerWithKey: function() {
      const newTrigger = Trigger.create();
      newTrigger.id = Math.random();
      return newTrigger;
    },
    makeTriggerLeft: function() {
      this.triggers.unshift(this.createTriggerWithKey());
    },
    makeTriggerRight: function() {
      this.triggers.push(this.createTriggerWithKey());
    },
    startAutoSum: function() {
      this.env.sumButton.setStop();
      this.frame.run = true;
      requestAnimationFrame(this.summatorLoop);
    },
    stopAutoSum: function() {
      this.env.sumButton.setStart();
    },
    startStopSum: function() {
      this.frame.run = false;
      if (this.state.length <= 0) {
        this.env.sumButton.showError();
        return;
      }
      if (this.currentAutoSumAction !== this.startAutoSum) {
        this.currentAutoSumAction = this.startAutoSum;
      } else {
        this.currentAutoSumAction = this.stopAutoSum;
      }
      this.currentAutoSumAction();
    },
  }
});
