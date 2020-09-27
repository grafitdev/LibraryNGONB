class ApiFetch {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  makeFetch(url, method = 'GET', type = undefined, field = undefined) {
    let data;
    let formData;

    if (field) {
      data = {
        iddb: '',
        ID: '',
        AU: '',
        TI: `${field}`,
        PY: '',
        PU: '',
        PP: '',
        RUSMARC: 1,
      }
      formData = new FormData();

      for (const name in data) {
        formData.append(name, data[name]);
      }

      formData = JSON.stringify(formData);
    }

    return fetch(`${this.baseUrl}${url}`, {
      headers: {
        'content-type': type,
      },
      // credentials: 'include',
      method,
      body: formData,
    })
      .then((resp) => {
        if (!resp.ok) {
          return resp.json().then(err => Promise.reject(err));
        }
        return resp.json();
      });
  }



  getInfo(field) {
    // return this.makeFetch('', 'POST', 'multipart/form-data', field);
    return this.makeFetch('', 'POST', 'application/json', field);
  }

}
