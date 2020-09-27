// import { store } from "./commonReduser";
// import notFoundImage from "../images/noPhoto.jpg";


class Card {

  create(card) {
    const {
      urlToImage = card.image,
      publishedAt = card.date,
      url = card.link,
      description = card.text,
      title,
      source: { name = card.source },
      keyword,
    } = card;

    const container = document.createElement('div');

    container.insertAdjacentHTML('beforeend',
      `<div class="result__card">
          <div class="result__description">
              <h3 class="result__card-title">Книга: <span
                      class="result__span result__span_book">${sanitize(title)}</span></h3>
              <p class="result__item">Автор: <span class="result__span result__span_author">${sanitize(author)}</span></p>
              <p class="result__item">Дата выпуска: <span class="result__span result__span_data">${sanitize(data)}</span></p>
              <p class="result__item">Издательство: <span class="result__span result__span_publishing">${sanitize(publishing)}</span></p>
              <p class="result__item">Месторасположение: <span class="result__span result__span_address">${sanitize(address)}</span></p>
              <p class="result__item result__item_storage">Хранение: <span class="result__span result__span_storage">${sanitize(storage)}</span></p>
          </div>
          <div class="result__buttons">
              <button class="result__button result__button_add">Доп. информация</button>
              <button class="result__button result__button_map">Построить маршрут</button>
          </div>
        </div>`
    );

    return container.firstElementChild;
  }
}
