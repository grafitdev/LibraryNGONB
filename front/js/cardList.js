class CardList {
  constructor(container, card, api, store, storeMethods) {
    this.container = container;
    this.card = card;
    this.api = api;
    this.store = store;
    this.storeMethods = storeMethods;
    this.preloader = document.querySelector('.preloader');
    this.resultBlock = document.querySelector('.result');
    this.cardsWrapper = document.querySelector('.result__cards-wrapper');
    this.oops = document.querySelector('.oops');
    this.errorBlock = document.querySelector('.result__error');
    this.showMoreBtn = document.querySelector('.result__showmore');
    this.numberOfClickMore = 0;


    // слушатель на весь контейнер
    this.container.addEventListener('click', this.eventHandler.bind(this), true);
  }


  addCard(card, {index}) {
    const newCard = this.card.create(card);
    newCard.dataset.number = index;
    this.container.append(newCard);
  }

  render(initialCards) {
    initialCards.forEach((card, index) => {
      this.addCard(card, {index});
    });

  }

  eventHandler(event) {
    if (event.target.classList.contains('result__bookmark') || event.target.matches('svg') || event.target.matches('path')) {
      const button = event.target.closest('.result__bookmark');
      const currentCard = event.target.closest('.result__card');
      const cardNumber = currentCard.dataset.number;

      if (button.matches('.result__bookmark_save') && !button.matches('.result__bookmark_marked') && !button.disabled) {
        const {
          urlToImage: image, publishedAt: date, title, description: text, url: link, source: {name: source}
        } = this.store.currentArticles[cardNumber];
        const data = {keyword: this.store.currentKeyWord, image, date, title, text, source, link};

        this.api.likeArticle(data)
          .then((article) => {
            this.card.toggleLike(button);
            currentCard.dataset.id = article.data._id;
          })
          .catch((err) => {
            console.dir(err)
          });

      } else if (button.matches('.result__bookmark_marked')) {
        const cardId = currentCard.dataset.id;
        this.api.dislikeArticle(cardId)
          .then((article) => {
            this.card.toggleLike(button);
          })
          .catch((err) => {
            console.dir(err)
          });

      } else if (button.matches('.result__bookmark_delete')) {
        const cardId = this.store.savedArticles[cardNumber]._id;

        this.api.dislikeArticle(cardId)
          .then((article) => {
            this.card.removeCard(currentCard)
          })
          .catch((err) => {
            console.dir(err)
          });

      } else if (button.matches('.result__bookmark_restore')) {
        const { keyword, image, date, title, text, source, link } = this.store.savedArticles[cardNumber];
        const data = {keyword, image, date, title, text, source, link};

        this.api.likeArticle(data)
          .then((article) => {
            this.card.restoreCard(currentCard);
            this.storeMethods.changeId(cardNumber, article.data._id);
          })
          .catch((err) => {
            console.dir(err)
          });
      }
    }
  }

  showElement(elem, isShown) {
    const element = this[elem];

    if (isShown) {
      element.classList.remove('elem-hidden');
    } else {
      element.classList.add('elem-hidden');
    }
  }
}
