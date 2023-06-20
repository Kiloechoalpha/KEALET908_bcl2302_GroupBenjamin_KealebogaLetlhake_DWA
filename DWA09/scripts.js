import { books, authors, genres, BOOKS_PER_PAGE } from './data.js';

class BookPreview {
  constructor(id, image, title, author) {
    this.id = id;
    this.image = image;
    this.title = title;
    this.author = author;
    this.element = this.createElement();
  }

  createElement() {
    const element = document.createElement('button');
    element.classList = 'preview';
    element.setAttribute('data-preview', this.id);

    element.innerHTML = `
      <img class="preview__image" src="${this.image}" />
      <div class="preview__info">
        <h3 class="preview__title">${this.title}</h3>
        <div class="preview__author">${authors[this.author]}</div>
      </div>
    `;

    return element;
  }
}

// Initialize page and set up initial state
let page = 1; // Current page
let matches = books; // Array of matched books

// Function to create an option element for genre or author selection
const createOptionElement = (value, name) => {
  const element = document.createElement('option');
  element.value = value;
  element.innerText = name;
  return element;
};

// Function to initialize the page with initial data and event listeners
const initializePage = () => {
  const starting = document.createDocumentFragment();
  const genreHtml = document.createDocumentFragment();
  const authorsHtml = document.createDocumentFragment();

  // Create BookPreview instances for the first set of books to display
  for (const { author, id, image, title } of matches.slice(0, BOOKS_PER_PAGE)) {
    const bookPreview = new BookPreview(id, image, title, author);
    starting.appendChild(bookPreview.element);
  }

  // Append the BookPreview elements to the list items container
  document.querySelector('[data-list-items]').appendChild(starting);

  // Create option elements for genres and append them to the genre selection dropdown
  const firstGenreElement = createOptionElement('any', 'All Genres');
  genreHtml.appendChild(firstGenreElement);
  for (const [id, name] of Object.entries(genres)) {
    const element = createOptionElement(id, name);
    genreHtml.appendChild(element);
  }
  document.querySelector('[data-search-genres]').appendChild(genreHtml);

  // Create option elements for authors and append them to the author selection dropdown
  const firstAuthorElement = createOptionElement('any', 'All Authors');
  authorsHtml.appendChild(firstAuthorElement);
  for (const [id, name] of Object.entries(authors)) {
    const element = createOptionElement(id, name);
    authorsHtml.appendChild(element);
  }
  document.querySelector('[data-search-authors]').appendChild(authorsHtml);

  // Determine the color scheme based on the user's preference or default to 'day'
  const colorScheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'night'
    : 'day';

  // Set the selected value of the theme selection dropdown
  document.querySelector('[data-settings-theme]').value = colorScheme;

  // Set the CSS variables for the color scheme
  const darkColor = colorScheme === 'night' ? '255, 255, 255' : '10, 10, 20';
  const lightColor = colorScheme === 'night' ? '10, 10, 20' : '255, 255, 255';
  document.documentElement.style.setProperty('--color-dark', darkColor);
  document.documentElement.style.setProperty('--color-light', lightColor);

  // Add event listeners for form submission and "Show more" button click
  document.querySelector('[data-search-form]').addEventListener('submit', handleSearchFormSubmit);
  document.querySelector('[data-list-button]').addEventListener('click', handleListButtonClick);
};

// Function to handle search form submission
const handleSearchFormSubmit = (event) => {
  event.preventDefault();

  // Get the form inputs
  const searchInput = document.querySelector('[data-search-input]').value.trim().toLowerCase();
  const selectedGenre = document.querySelector('[data-search-genres]').value;
  const selectedAuthor = document.querySelector('[data-search-authors]').value;

  // Filter the books based on the search inputs
  matches = books.filter((book) => {
    const hasMatchingTitle = book.title.toLowerCase().includes(searchInput);
    const hasMatchingGenre = selectedGenre === 'any' || book.genre === selectedGenre;
    const hasMatchingAuthor = selectedAuthor === 'any' || book.author === selectedAuthor;

    return hasMatchingTitle && hasMatchingGenre && hasMatchingAuthor;
  });

  // Reset the current page
  page = 1;

  // Update the UI with the filtered results
  const listItems = document.querySelector('[data-list-items]');
  listItems.innerHTML = '';
  const newItems = document.createDocumentFragment();

  for (const { author, id, image, title } of matches.slice(0, BOOKS_PER_PAGE)) {
    const bookPreview = new BookPreview(id, image, title, author);
    newItems.appendChild(bookPreview.element);
  }

  listItems.appendChild(newItems);

  // Scroll to the top of the results
  listItems.scrollTop = 0;
};

// Function to handle "Show more" button click
const handleListButtonClick = () => {
  const fragment = document.createDocumentFragment();

  for (const { author, id, image, title } of matches.slice(page * BOOKS_PER_PAGE, (page + 1) * BOOKS_PER_PAGE)) {
    const bookPreview = new BookPreview(id, image, title, author);
    fragment.appendChild(bookPreview.element);
  }

  document.querySelector('[data-list-items]').appendChild(fragment);
  page += 1;
};

// Call the initializePage function to set up the page
initializePage();