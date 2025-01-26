// add variable references and event listeners here!
// Fetch books based on user input
async function searchBooks(query, type) {
    const baseUrl = "https://www.googleapis.com/books/v1/volumes";
    const response = await fetch(`${baseUrl}?q=${type}:${encodeURIComponent(query)}&maxResults=10`);
    const data = await response.json();
  
    return data.items.map(book => ({
      title: book.volumeInfo.title || "Unknown Title",
      author_name: book.volumeInfo.authors ? book.volumeInfo.authors.join(", ") : "Unknown Author",
      isbn: book.volumeInfo.industryIdentifiers ? book.volumeInfo.industryIdentifiers[0].identifier : "N/A",
      cover_i: book.volumeInfo.imageLinks?.thumbnail,
      ebook_access: book.accessInfo?.embeddable ? "Borrowable" : "Not Borrowable",
      first_publish_year: book.volumeInfo.publishedDate || "Unknown",
      ratings_sortable: book.volumeInfo.averageRating || 0,
    }));
  }
  
  // Display book results
  function displayBookList(books) {
    const bookList = document.getElementById("book-list");
    bookList.innerHTML = ""; // Clear previous results
  
    books.forEach(book => {
      const li = document.createElement("li");
  
      li.innerHTML = `
        <div class="title-element">${book.title}</div>
        <div class="author-element">${book.author_name}</div>
        <img class="cover-element" src="${book.cover_i}" alt="Book Cover" />
        <div class="rating-element">Rating: ${book.ratings_sortable}</div>
        <div class="ebook-element">E-Book: ${book.ebook_access}</div>
      `;
  
      li.addEventListener("click", () => displaySingleBook(book));
      bookList.appendChild(li);
    });
  }
  
  // Handle search form submission
  async function handleSearch(event) {
    event.preventDefault();
  
    const query = document.getElementById("search-input").value;
    const type = document.getElementById("search-type").value;
  
    try {
      const books = await searchBooks(query, type);
      displayBookList(books);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  }
  
  // Display a single book's details
  function displaySingleBook(book) {
    const selectedBook = document.getElementById("selected-book");
    const bookList = document.getElementById("book-list");
  
    selectedBook.innerHTML = `
      <h2>${book.title}</h2>
      <p><strong>Author:</strong> ${book.author_name}</p>
      <p><strong>First Published:</strong> ${book.first_publish_year}</p>
      <p><strong>ISBN:</strong> ${book.isbn}</p>
      <img src="${book.cover_i}" alt="Book Cover" />
      <p><strong>Rating:</strong> ${book.ratings_sortable}</p>
      <p><strong>E-Book Access:</strong> ${book.ebook_access}</p>
    `;
  
    selectedBook.hidden = false;
    bookList.hidden = true;
  }
  
  // Handle e-book filter
  function handleFilter() {
    const books = Array.from(document.querySelectorAll("#book-list li"));
    const filterEbooks = document.getElementById("ebook-filter").checked;
  
    books.forEach(book => {
      const ebook = book.querySelector(".ebook-element").textContent.includes("borrowable");
      book.style.display = filterEbooks && !ebook ? "none" : "";
    });
  }
  
  // Sort the displayed book list by rating
  function handleSort() {
    const bookList = document.getElementById("book-list");
    const books = Array.from(bookList.children);
  
    books.sort((a, b) => {
      const ratingA = parseFloat(a.querySelector(".rating-element").textContent.replace("Rating: ", "")) || 0;
      const ratingB = parseFloat(b.querySelector(".rating-element").textContent.replace("Rating: ", "")) || 0;
      return ratingB - ratingA;
    });
  
    bookList.innerHTML = "";
    books.forEach(book => bookList.appendChild(book));
  }
  
  // Add event listeners
  document.getElementById("search-form").addEventListener("submit", handleSearch);
  document.getElementById("ebook-filter").addEventListener("change", handleFilter);
  document.getElementById("sort-rating").addEventListener("click", handleSort);
  