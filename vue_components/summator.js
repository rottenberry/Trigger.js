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
    summator.frame.rate = 30;
    summator.frame.fastestPerAdd = 3;
    summator.frame.slowestPerAdd = 60;
    summator.frame.lastAddCount = 0;
    summator.frame.step = 10;
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
    cantSlowDown() {
      return this.frame.rate >= this.frame.slowestPerAdd;
    },
    cantSpeedUp() {
      return this.frame.rate <= this.frame.fastestPerAdd;
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
    const summatorLoop = function() {
      if (!this.frame.run) return;

      if (this.frame.lastAddCount++ >= this.frame.rate) {
        this.frame.lastAddCount = 0;

        this.add();
      }
      requestAnimationFrame(this.summatorLoop);
    };
    this.summatorLoop = summatorLoop.bind(this);
  },
  methods: {
    speedUp() {
      const newFrameRate = this.frame.rate - this.frame.step;
      if (newFrameRate <= this.frame.fastestPerAdd) {
        this.frame.rate = this.frame.fastestPerAdd;
      } else {
        this.frame.rate = newFrameRate;
      }
    },
    slowDown() {
      const newFrameRate = this.frame.rate + this.frame.step;
      if (newFrameRate >=this.frame.slowestPerAdd) {
        this.frame.rate = this.frame.slowestPerAdd;
      } else {
        this.frame.rate = newFrameRate;
      }
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
