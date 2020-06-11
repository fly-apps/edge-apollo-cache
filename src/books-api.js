const { RESTDataSource } = require('apollo-datasource-rest');

class BooksApi extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'http://openlibrary.org/';
  }

  async getBook(id) {
    const data = await this.get(`api/books.json`, {
      bibkeys: id,
    });
    return data[id];
  }

  async getSearchBooks(search, type='q') {
    const data = await this.get('search.json', {
      [type]: search,
    });
    return data.docs;
  }
}

module.exports = BooksApi;
