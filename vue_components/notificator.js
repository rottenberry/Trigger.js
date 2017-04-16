Vue.component('notificator', {
  props: ['env'],
  data() {
    return {
      notifications: []
    };
  },
  created() {
    this.$options.template = this.env.template;
  },
  computed: {
    amount() {
      return this.notifications.length;
    },
  },
  watch: {
    amount(newValue, oldValue) {
      if (newValue > 16 && newValue > oldValue){
        for(let i = 0; i < 10; i++) this.notifications.shift();
      }
    },
  },
  methods: {
    add(notificationObject) {
      this.notifications.push(notificationObject);
      setTimeout(() => {
        notificationObject.active = false;
        this.deleteOldNotifications();
      }, 4000);
    },
    deleteOldNotifications() {
      this.notifications = this.notifications.filter( (el) => el.active);
    },
  },
});
