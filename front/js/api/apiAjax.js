class ApiAjax {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  makeFetch(field = undefined) {
    var request = {
      //'type': $('input[name=type]:checked').val(),
      'iddb': '',
      'ID': '',
      'AU': '',
      'TI': field,
      'PY': '',
      'PU': '',
      'PP': '',
      'RUSMARC': 1,
    };
    return $.ajax({
      //url: "/opacg.integration.smev/STORAGE/opacfindd/FindView/2.3.0",
      url: this.baseUrl,
      type: "post",
      data: request,
      dataType: "text", //"json",
      error: function () {
        console.log("error");
      }
    })
  }


  getInfo(field) {
    return this.makeFetch(field);
  }

}
