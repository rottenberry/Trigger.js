(function() {

Vue.component('permutator', {
  props: ['env'],
  data: function() {
    return {
      inputs: [],
      permutations: [],
      button: {
        title: 'generate',
        classObject: {
          button: true,
          "is-success": true,
          'is-danger': false,
        },
        setGenerate: function() {
          this.title = 'generate';
          this.classObject['is-danger'] = false;
          this.classObject['is-success'] = true;
        },
        setClear: function() {
          this.title = 'clear';
          this.classObject['is-success'] = false;
          this.classObject['is-danger'] = true;
        }        
      }
    };
  },
  methods: {
    addFind: function () {
      this.inputs.push({ value: '01' });
    },
    getValues: function() {
      return this.inputs.map((el) => el.value).filter((el) => el.length > 0);
    },
    permutate: function() {
      const triggers = this.getValues().map((el) => Trigger.create(el) );
      const permutator = Permutator.create(triggers);
      permutator.promote();
      this.setPermutations(permutator.permutations.slice());
    },
    clearPermutations: function() {
      this.permutations = [];
    },
    setPermutations: function(newPermutations) {
      this.clearPermutations();
      this.permutations = newPermutations;
    },
    permutateClear: function() {
      if (this.currentAction !== this.permutate) {
        this.currentAction = this.permutate;
        this.button.setClear();
      } else {
        this.currentAction = this.clearPermutations;
        this.button.setGenerate();
      }
      this.currentAction();
    }
  },
  computed: {
    showResult: function() {
      return this.permutations.length > 0;
    },
    text: function() {
      return this.permutations.map((el) => el.join('')).join('  ');
    }
  },
  created: function() {
    this.$options.template = this.env.template;
  },
  mounted: function() {
    this.inputs.push({value: '01'});
    this.currentAction = null;
  },
});

const permutator = new Vue({
  el: '#permutator',
  data: {
    env: {
      template: permutatorTemplate.innerHTML,
    }
  }
});
  
})();