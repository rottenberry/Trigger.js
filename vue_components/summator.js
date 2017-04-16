(function() {
  Vue.component("trigger", {
    template: triggerTemplate.innerHTML,
    props: ["trigger"],
    data: function() {
      return this.trigger;
    },
  });


  const triggers = [
    Trigger.create(),
    Trigger.create(),
    Trigger.create(),
    Trigger.create()
  ];
  triggers.forEach((el) => el.id = Math.random());

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
      this.autoSumTimer = null;
      this.currentAutoSumAction = null;
      this.$options.template = this.env.template;
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
        this.autoSumTimer = setInterval(() => this.add(), 500);
        this.env.sumButton.setStop();
      },
      stopAutoSum: function() {      
        this.env.sumButton.setStart();
      },    
      startStopSum: function() {
        clearInterval(this.autoSumTimer);
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

  const vue = new Vue({
    el: '#summator_component',
    data: {
      env: {
        params: {
          MAX_SIZE: 16,
        },
        template: summatorTemplate.innerHTML,
        triggers: triggers,
        sumButton: {
          classObject: {
            "is-warning": false,
            "is-success": true,
            "is-danger": false,
            "summator-control": true,
            "button": true,
          },
          title: "start",
          setStop: function () {
            this.setClass('is-warning');
            this.title = "stop";
          },
          setStart: function() {
            this.setClass('is-success');
            this.title = "resume";
          },
          showError: function() {
            this.classObject('is-danger');
            this.title = "NO TRIGGERS";
            setTimeout(() => {
              this.setClass('is-success');            
              this.title = oldTitle;
            }, 1200);
          },
          setClass: function(className) {
            this.classObject['is-danger'] = false;
            this.classObject['is-success'] = false;
            this.classObject['is-warning'] = false;
            this.classObject[className] = true;
          },
        },
        addLeftButton: {
          title: 'add left',
          setDisabledTitle: function() {
            this.title = 'full';
          },
          setEnabledTitle: function() {
            this.title = 'add left';
          }
        },
        addRightButton: {
          title: "add right",
          setDisabledTitle: function() {
            this.title = 'full';
          },
          setEnabledTitle: function() {
            this.title = 'add right';
          }
        }
      }
    }
  });  
})();