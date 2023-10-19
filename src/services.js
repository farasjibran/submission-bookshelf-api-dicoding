const { nanoid } = require("nanoid");
const books = require("./books");

// services to add books
const addBookServices = (request, res) => {
    const {
        name, year, author, summary, publisher,
        pageCount, readPage, reading,
    } = request.payload;

    if(!name) {
        const response = res.response({
            status: "fail",
            message: "Gagal menambahkan buku. Mohon isi nama buku",
        });
        response.code(400);
        return response;
    }

    if(readPage > pageCount) {
        const response = res.response({
            status: "fail",
            message: "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
        });
        response.code(400);
        return response;
    }

    const id = nanoid(16);
    const finished = pageCount === readPage;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const newBook = {
        name, year, author, summary, publisher,
        pageCount, readPage, finished, reading, id,
        insertedAt, updatedAt,
    };

    books.push(newBook);

    const isSuccess = books.filter((book) => book.id === id).length > 0;

    if(isSuccess) {
        const response = res.response({
            status: "success",
            message: "Buku berhasil ditambahkan",
            data: {
                bookId: id,
            },
        });
        response.code(201);
        return response;
    }

    const response = res.response({
        status: "fail",
        message: "Buku gagal ditambahkan",
    });
    response.code(500);
    return response;
};

// services for get all books 
const getAllBooksServices = (request, res) => {
    const {
        name, reading, finished
    } = request.query;

    if(!name && !reading && !finished) {
        const response = res.response({
            status: "success",
            data: {
                books: books.map((book) => ({
                    id: book.id, name: book.name, publisher: book.publisher,
                })),
            },
        });
        response.code(200);
        return response;
    }

    if(name) {
        const filteredBooksName = books.filter((book) => {
            const nameRegex = new RegExp(name, "gi");
            return nameRegex.test(book.name);
        });
        const response = res.response({
            status: "success",
            data: {
                books: filteredBooksName.map((book) => ({
                    id: book.id, name: book.name, publisher: book.publisher,
                })),
            },
        });
        response.code(200);
        return response;
    }

    if(reading) {
        const filteredBooksReading = books.filter((book) => Number(book.reading) === Number(reading),);
        const response = res.response({
            status: "success",
            data: {
                books: filteredBooksReading.map((book) => ({
                    id: book.id, name: book.name, publisher: book.publisher,
                })),
            },
        });
        response.code(200);
        return response;
    }

    const filteredBooksFinished = books.filter((book) => Number(book.finished) === Number(finished),);

    const response = res.response({
        status: "success",
        data: {
            books: filteredBooksFinished.map((book) => ({
                id: book.id, name: book.name, publisher: book.publisher,
            })),
        },
    });
    response.code(200);
    return response;
};

// services to get books by id
const getBookByIdHandler = (request, res) => {
    const { bookId } = request.params;
    const book = books.filter((n) => n.id === bookId)[0];
    
    if (book) {
        const response = res.response({
            status: "success",
            data: {
                book,
            },
        });
        response.code(200);
        return response;
    }
    
    const response = res.response({
        status: "fail",
        message: "Buku tidak ditemukan",
    });
    response.code(404);
    return response;
};

// services to edit books by id
const editBookByIdHandler = (request, res) => {
    const { bookId } = request.params;
    const {
        name, year, author, summary, publisher,
        pageCount, readPage, reading,
    } = request.payload;
    
    if(!name) {
        const response = res.response({
            status: "fail",
            message: "Gagal memperbarui buku. Mohon isi nama buku",
        });
        response.code(400);
        return response;
    }
    
    if(readPage > pageCount) {
        const response = res.response({
            status: "fail",
            message: "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
        });
        response.code(400);
        return response;
    }

    const finished = pageCount === readPage;
    const updatedAt = new Date().toISOString();
    const index = books.findIndex((note) => note.id === bookId); // find book by id
    
    if(index !== -1) {
        books[index] = {
            ...books[index], name, year, author,
            summary, publisher, pageCount, readPage,
            reading, finished, updatedAt,
        };
        
        const response = res.response({
            status: "success",
            message: "Buku berhasil diperbarui",
        });
        response.code(200);
        return response;
    }
    
    const response = res.response({
        status: "fail",
        message: "Gagal memperbarui buku. Id tidak ditemukan",
    });
    response.code(404);
    return response;
};

// services to delete books by id
const deleteBookByIdHandler = (request, res) => {
    const { bookId } = request.params;
    const index = books.findIndex((book) => book.id === bookId);

    if(index !== -1) {
        books.splice(index, 1);
        const response = res.response({
            status: "success",
            message: "Buku berhasil dihapus",
        });
        response.code(200);
        return response;
    }

    const response = res.response({
        status: "fail",
        message: "Buku gagal dihapus. Id tidak ditemukan",
    });
    response.code(404);
    return response;
};

module.exports = {
    addBookServices,
    getAllBooksServices,
    getBookByIdHandler,
    editBookByIdHandler,
    deleteBookByIdHandler,
};