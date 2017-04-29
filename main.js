const Notification = new Vue({
  el: '#notificationsHolderTopRight',
  data: {
    env: {
      template: notificatorTemplate.innerHTML,
    }
  },
  methods: {
    show(text, type) {
      this.$refs.main.add(this.makeNotification(text, type));
    },
    showError(text) {
      this.show(text, 'danger');
    },
    makeNotification(text, type = "") {
      const makeBulmaClassObject = (type) => {
        const classObject =  {
          'notification': true,
          'is-danger': false,
          'is-warning': false,
          'is-info': false,
          'is-success': false,
          'is-primary': false,
        };

        const field = `is-${type}`;
        if (type !== "" && classObject.hasOwnProperty(field)) {
          classObject[field] = true;
        }
        return classObject;
      };
      return {
        text: text,
        classObject: makeBulmaClassObject(type),
        active: true,
      };
    },
  },
});

const triggers = [
  Trigger.create(),
  Trigger.create(),
  Trigger.create(),
  Trigger.create()
];
triggers.forEach((el) => el.id = Math.random());

const summator = new Vue({
  el: '#summator_component',
  data: {
    env: {
      params: {
        MAX_SIZE: 16,
      },
      Notification: Notification,
      errorMessages: {
        'summator-full': 'The summator is full. You cannot add more triggers.',
        'too-slow': 'The slowest speed reached. You cannot slow down more.',
        'too-fast': 'The highest speed reached. You cannot speed up more.',
      },
      infoMessages:{
        'summator-freq': 'The summator increases its value #times# times per second.',
      },
      template: summatorTemplate.innerHTML,
      triggers: triggers,
      sumButton: {
        classObject: {
          "is-warning": false,
          "is-success": true,
          "is-danger": false,
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
          this.setClass('is-danger');
          const oldTitle = this.title;
          this.title = "no triggers";
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

const permutator = new Vue({
  el: '#permutator',
  data: {
    env: {
      template: permutatorTemplate.innerHTML,
    }
  }
});

const square = new Vue({
  el: '#sqr',
  data: {
    xDisabled: false,
    xxDisabled: false,
    square: 2,
    power: 4,
    constants: {
      MAX_SQUARE: 65536,
    },
  },
  methods: {
    xx(number) {
      return Math.pow(number, 2);
    },
    roundSquare(number) {
      return Math.trunc(Math.sqrt(number));
    },
  },
  watch: {
    square: Debouncer.create({
      onStart: function() {this.xxDisabled = true;},
      onShedule: function(newValue) {
        let newSquare;
        if (newValue <= this.constants.MAX_SQUARE) newSquare = newValue;
        else newSquare = this.constants.MAX_SQUARE;
        this.power = this.xx(newSquare);
        this.square = newSquare;
      },
      onEnd: function() {this.xxDisabled = false;},
      delayTime: 1000,
    }),
    power: Debouncer.create({
      onStart() {this.xDisabled = true;},
      onShedule(newValue) {
        this.xxDisabled = true;
        if (this.xx(this.square) !== this.power) {
          this.power = this.xx(this.square);
        }
        this.square = this.roundSquare(newValue);
      },
      onEnd() {
        this.xxDisabled = false;
        this.xDisabled = false;
      },
      delayTime: 1000,
    }),
  }
});