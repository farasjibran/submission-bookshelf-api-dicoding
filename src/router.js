const {
  addBookServices,
  getAllBooksServices,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
} = require('./services');

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: addBookServices,
  },
  {
    method: 'GET',
    path: '/books',
    handler: getAllBooksServices,
  },
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: getBookByIdHandler,
  },
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: editBookByIdHandler,
  },
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: deleteBookByIdHandler,
  },
]

module.exports = routes;