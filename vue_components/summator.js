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
    template: summatorTemplate.innerHTML,
    data: function() {
      const summator = Summator.create(this.env.triggers);
      summator.triggers = summator.getTriggers();
      return summator;
    },
    watch: {
      triggers: function() {
        this.updateState();
      }
    },
    computed: {
      sumValue: function() {
        if (this.state.length <= 0) return 0;
        return parseInt(this.state.join(""), 2);
      }
    },
    created: function() {
      this.autoSumTimer = null;
      this.currentAutoSumAction = null;
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
      }
    }
  });  
})();