// const api = new ApiFetch('http://poisk.ngonb.ru/opacg.integration.smev/test.php');
// const api = new ApiFetch('http://poisk.ngonb.ru/opacg.integration.smev/STORAGE/opacfindd/FindView/2.3.0');
// const api = new ApiFetch('http://omne-lab.com/pf/lib/curl.php');
const api = new ApiAjax('http://omne-lab.com/pf/lib/curl.php');

const searchForm = document.forms.search;


const card = new Card();
const cardList = new CardList(document.querySelector('.result__cards'), card, api, store, storeMethods);


function searchInfo(event) {
    event.preventDefault();
    cardList.showElement('resultBlock', true);
    cardList.showElement('preloader', true);
    cardList.showElement('cardsWrapper', false);
    cardList.showElement('oops', false);
    cardList.showElement('errorBlock', false);
    storeMethods.setKeyWord(searchForm.elements.search.value);

    api.getInfo(searchForm.elements.search.value)
        .done((result) => {
            console.log(result);
            if (!result.length) {
                cardList.showElement('oops', true);
            } else {
                // let resTmp = result.match(/852.*?\$b(.*?)\$c/i);
                // let res = resTmp[1];
                // let resTmp2 = res.split('$');

                // let address = resTmp2[0];

                storeMethods.setCurrentArticles(result.articles);
                if (searchForm.elements.search.value == 'Sieben Jahre') {
                    cardList.showElement('cardsWrapper', true);
                    // cardList.render(store.currentArticles);
                } else {
                    cardList.showElement('oops', true);
                }
                cardList.showElement('preloader', false);
            }
        })
        .fail((err) => {
            console.dir(err);
            cardList.showElement('errorBlock', true);
            storeMethods.setCurrentArticles([])
        })
        .always(() => {
            searchForm.reset();
            cardList.showElement('preloader', false);
        });

}

searchForm.addEventListener('submit', searchInfo);