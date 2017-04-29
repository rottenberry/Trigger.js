const Template = {
  create(templateString) {
    const self = Object.create(this);
    this.init(self, templateString);
    return self;
  },
  init(self, templateString) {
    self.getString = () => templateString;
    self.resolve = (values) => {
      let replacableTemplate = self.getString();
      for (let i in values) {
        replacableTemplate = replacableTemplate.replace(`#${i}#`, values[i]);
      }
      return replacableTemplate;
    }
  },
};