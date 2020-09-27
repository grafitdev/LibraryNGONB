const store = {
  currentKeyWord: '',
  currentArticles: [],
  constants: {
    // можно здесь определить все элементы и использовать одну функцию modifyElement для управления
  }
};


const storeMethods = {
  setKeyWord(value) {
    return store.currentKeyWord = value;
  },

  setCurrentArticles(articles) {
    return store.currentArticles = articles;
  },

};

