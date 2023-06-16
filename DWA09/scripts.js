import { books, authors, genres, BOOKS_PER_PAGE } from './data.js';

class BookPreview extends HTMLElement {
  constructor() {
    super();

    // Initialize page and set up initial state
    this.page = 1; // Current page
    this.matches = books; // Array of matched books
  }

  connectedCallback() {
    this.render();
    this.initializeEventListeners();
  }

  render() {
    this.innerHTML = `
      <!-- Your HTML structure for the book preview goes here -->
    `;
    // Create button elements for the first set of books to display
    const starting = document.createDocumentFragment();
    for (const { author, id, image, title } of this.matches.slice(0, BOOKS_PER_PAGE)) {
      const element = this.createButtonElement(id, image, title, author);
      starting.appendChild(element);
    }

    // Append the button elements to the list items container
    this.querySelector('[data-list-items]').appendChild(starting);

    // Create option elements for genres and append them to the genre selection dropdown
    const genreHtml = document.createDocumentFragment();
    const firstGenreElement = this.createOptionElement('any', 'All Genres');
    genreHtml.appendChild(firstGenreElement);
    for (const [id, name] of Object.entries(genres)) {
      const element = this.createOptionElement(id, name);
      genreHtml.appendChild(element);
    }
    this.querySelector('[data-search-genres]').appendChild(genreHtml);

    // Create option elements for authors and append them to the author selection dropdown
    const authorsHtml = document.createDocumentFragment();
    const firstAuthorElement = this.createOptionElement('any', 'All Authors');
    authorsHtml.appendChild(firstAuthorElement);
    for (const [id, name] of Object.entries(authors)) {
      const element = this.createOptionElement(id, name);
      authorsHtml.appendChild(element);
    }
    this.querySelector('[data-search-authors]').appendChild(authorsHtml);

    // Determine the color scheme based on the user's preference or default to 'day'
    const colorScheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'night'
      : 'day';

    // Set the selected value of the theme selection dropdown
    this.querySelector('[data-settings-theme]').value = colorScheme;

    // Set the CSS variables for the color scheme
    const darkColor = colorScheme === 'night' ? '255, 255, 255' : '10, 10, 20';
    const lightColor = colorScheme === 'night' ? '10, 10, 20' : '255, 255, 255';
    document.documentElement.style.setProperty('--color-dark', darkColor);
    document.documentElement.style.setProperty('--color-light', lightColor);

    // Set up remaining count and update the "Show more" button text
    const remainingCount = Math.max(0, this.matches.length - (this.page * BOOKS_PER_PAGE));
    this.querySelector('[data-list-button]').innerHTML = `
      <span>Show more</span>
      <span class="list__remaining"> (${remainingCount})</span>
    `;

    // Scroll to the top of the page
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Close the search overlay
    this.querySelector('[data-search-overlay]').open = false;
  }

  initializeEventListeners() {
    // Add event listeners for search and settings forms, search overlay, and settings overlay
    this.querySelector('[data-search-cancel]').addEventListener('click', () => {
      this.querySelector('[data-search-overlay]').open = false;
    });

    this.querySelector('[data-settings-cancel]').addEventListener('click', () => {
      this.querySelector('[data-settings-overlay]').open = false;
    });

    this.querySelector('[data-header-search]').addEventListener('click', () => {
      this.querySelector('[data-search-overlay]').open = true;
      this.querySelector('[data-search-title]').focus();
    });

    this.querySelector('[data-header-settings]').addEventListener('click', () => {
      this.querySelector('[data-settings-overlay]').open = true;
    });
    

    // Add event listeners for closing the book details and handling form submissions
    this.querySelector('[data-list-close]').addEventListener('click', () => {
      this.querySelector('[data-list-active]').open = false;
    });

    this.querySelector('[data-settings-form]').addEventListener('submit', this.handleSettingsFormSubmit.bind(this));

    this.querySelector('[data-search-form]').addEventListener('submit', this.handleSearchFormSubmit.bind(this));

    this.querySelector('[data-list-button]').addEventListener('click', this.handleListButtonClick.bind(this));

    this.querySelector('[data-list-items]').addEventListener('click', this.handleBookItemClick.bind(this));
  }

  createButtonElement(id, image, title, author) {
    const element = document.createElement('button');
    element.classList = 'preview';
    element.setAttribute('data-preview', id);

    const imageElement = document.createElement('img');
    imageElement.classList = 'preview__image';
    imageElement.src = image;

    const infoElement = document.createElement('div');
    infoElement.classList = 'preview__info';

    const titleElement = document.createElement('h3');
    titleElement.classList = 'preview__title';
    titleElement.innerText = title;

    const authorElement = document.createElement('div');
    authorElement.classList = 'preview__author';
    authorElement.innerText = authors[author];

    infoElement.appendChild(titleElement);
    infoElement.appendChild(authorElement);

    element.appendChild(imageElement);
    element.appendChild(infoElement);

    return element;
  }

  createOptionElement(value, name) {
    const element = document.createElement('option');
    element.value = value;
    element.innerText = name;
    return element;
  }

  handleSettingsFormSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const { theme } = Object.fromEntries(formData);
    const darkColor = theme === 'night' ? '255, 255, 255' : '10, 10, 20';
    const lightColor = theme === 'night' ? '10, 10, 20' : '255, 255, 255';
    document.documentElement.style.setProperty('--color-dark', darkColor);
    document.documentElement.style.setProperty('--color-light', lightColor);
    this.querySelector('[data-settings-overlay]').open = false;
  }

  handleSearchFormSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const filters = Object.fromEntries(formData);
    const result = [];

    // Filter books based on the search criteria
    for (const book of books) {
      let genreMatch = filters.genre === 'any';

      for (const singleGenre of book.genres) {
        if (genreMatch) break;
        if (singleGenre === filters.genre) {
          genreMatch = true;
        }
      }

      if (
        (filters.title.trim() === '' || book.title.toLowerCase().includes(filters.title.toLowerCase())) &&
        (filters.author === 'any' || book.author === filters.author) &&
        genreMatch
      ) {
        result.push(book);
      }
    }

    // Reset page and update the matches with the filtered results
    this.page = 1;
    this.matches = result;

    // Update the UI with the filtered results
    const listMessage = this.querySelector('[data-list-message]');
    listMessage.classList.toggle('list__message_show', result.length < 1);

    const listItems = this.querySelector('[data-list-items]');
    listItems.innerHTML = '';
    const newItems = document.createDocumentFragment();

    for (const { author, id, image, title } of result.slice(0, BOOKS_PER_PAGE)) {
      const element = this.createButtonElement(id, image, title, author);
      newItems.appendChild(element);
    }

    listItems.appendChild(newItems);
    this.querySelector('[data-list-button]').disabled = (this.matches.length - (this.page * BOOKS_PER_PAGE)) < 1;
    const remainingCount = Math.max(0, this.matches.length - (this.page * BOOKS_PER_PAGE));
    this.querySelector('[data-list-button]').innerHTML = `
      <span>Show more</span>
      <span class="list__remaining"> (${remainingCount})</span>
    `;

    // Scroll to the top of the page
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Close the search overlay
    this.querySelector('[data-search-overlay]').open = false;
  }

  handleListButtonClick() {
    const fragment = document.createDocumentFragment();

    for (const { author, id, image, title } of this.matches.slice(this.page * BOOKS_PER_PAGE, (this.page + 1) * BOOKS_PER_PAGE)) {
      const element = this.createButtonElement(id, image, title, author);
      fragment.appendChild(element);
    }

    this.querySelector('[data-list-items]').appendChild(fragment);
    this.page += 1;
  }

  handleBookItemClick(event) {
    const target = event.target.closest('[data-preview]');
    if (target) {
      const active = books.find((book) => book.id === target.dataset.preview);
      if (active) {
        this.showBookDetails(active);
      }
    }
  }

  showBookDetails(book) {
    const listActive = this.querySelector('[data-list-active]');
    listActive.open = true;
    this.querySelector('[data-list-blur]').src = book.image;
    this.querySelector('[data-list-image]').src = book.image;
    this.querySelector('[data-list-title]').innerText = book.title;
    this.querySelector('[data-list-subtitle]').innerText = `${authors[book.author]} (${new Date(book.published).getFullYear()})`;
    this.querySelector('[data-list-description]').innerText = book.description;
  }
}

// Define the new element
customElements.define('book-preview', BookPreview);