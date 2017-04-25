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
    sumValue: function() {
      if (this.state.length <= 0) return 0;
      return parseInt(this.state.join(""), 2);
    },
    cantAddMore: function() {
      return this.triggers.length >= this.env.params.MAX_SIZE;
    }
  },
  created: function() {
    this.frame = {};
    this.frame.run = true;
    this.frame.perAdd = 30;
    this.frame.lastAddCount = 0;
    this.currentAutoSumAction = null;
    this.$options.template = this.env.template;
    const summatorLoop = function() {
      if (!this.frame.run) return;

      if (this.frame.lastAddCount++ >= this.frame.perAdd) {
        this.frame.lastAddCount = 0;

        this.add();
      }
      requestAnimationFrame(this.summatorLoop);
    };
    this.summatorLoop = summatorLoop.bind(this);
  },
  methods: {
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
