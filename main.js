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

const permutator = new Vue({
  el: '#permutator',
  data: {
    env: {
      template: permutatorTemplate.innerHTML,
    }
  }
});

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
