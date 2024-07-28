<template>
  <div class="container mt-5">
    <div v-if="loading" class="text-center">
      <div class="spinner-border text-primary" role="status"></div>
      <div class="sr-only">Loading...</div>
    </div>
    <div v-if="error" class="alert alert-danger">{{ error }}</div>
    <div v-else>
      <div class="d-flex justify-content-between align-items-center mb-4">
        <span class="page-info"> </span>
        <div class="dropdown filter-dropdown">
          <button
            class="btn btn-filter dropdown-toggle"
            type="button"
            id="authorFilterDropdown"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {{ selectedAuthor || "Filter by Author" }}
          </button>
          <ul class="dropdown-menu" aria-labelledby="authorFilterDropdown">
            <li>
              <a class="dropdown-item" href="#" @click="clearFilter">
                Clear Filter
              </a>
            </li>
            <li v-for="author in authors" :key="author">
              <a class="dropdown-item" href="#" @click="filterByAuthor(author)">
                {{ author }}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div class="row">
        <div
          v-for="book in paginatedBooks"
          :key="book.id"
          class="col-md-4 mb-4"
        >
          <div class="card">
            <img
              :src="book.volumeInfo.imageLinks?.thumbnail"
              class="card-img-top"
              alt="Book cover"
            />
            <div class="card-body">
              <h5 class="card-title" :title="book.volumeInfo.title">
                {{ book.volumeInfo.title }}
              </h5>
              <h6 class="card-subtitle mb-2 text-muted">
                <span
                  class="author-text"
                  :title="book.volumeInfo.authors?.join(', ')"
                >
                  {{ book.volumeInfo.authors?.join(", ") }}
                </span>
              </h6>
              <p
                class="card-text"
                v-html="
                  book.volumeInfo.description
                    ? book.volumeInfo.description.substring(0, 100) + '...'
                    : 'No description available.'
                "
              ></p>
              <router-link :to="'/book/' + book.id" class="btn btn-primary">
                View Details
              </router-link>
            </div>
          </div>
        </div>
      </div>
      <div class="d-flex justify-content-between align-items-center mt-4">
        <button
          class="btn btn-pagination"
          :disabled="currentPage === 1"
          @click="prevPage"
        >
          Previous
        </button>
        <span class="current-page">
          Page {{ currentPage }} of {{ totalPages }}
        </span>
        <button
          class="btn btn-pagination"
          :disabled="currentPage === totalPages"
          @click="nextPage"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      books: [],
      authors: [],
      selectedAuthor: "",
      currentPage: 1,
      booksPerPage: 3,
      loading: true,
      error: "",
    };
  },
  computed: {
    filteredBooks() {
      if (this.selectedAuthor) {
        return this.books.filter((book) =>
          book.volumeInfo.authors?.includes(this.selectedAuthor)
        );
      }
      return this.books;
    },
    paginatedBooks() {
      const start = (this.currentPage - 1) * this.booksPerPage;
      const end = start + this.booksPerPage;
      return this.filteredBooks.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredBooks.length / this.booksPerPage);
    },
  },
  methods: {
    async fetchBooks() {
      this.loading = true;
      try {
        const response = await fetch(
          "https://www.googleapis.com/books/v1/volumes?q=vue.js"
        );
        const data = await response.json();
        this.books = data.items || [];
        this.authors = [
          ...new Set(
            this.books.flatMap((book) => book.volumeInfo.authors || [])
          ),
        ];
        this.loading = false;
      } catch (err) {
        this.error = "Failed to fetch books. Please try again later.";
        this.loading = false;
      }
    },
    filterByAuthor(author) {
      this.selectedAuthor = author;
      this.currentPage = 1;
    },
    clearFilter() {
      this.selectedAuthor = "";
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
  },
  created() {
    this.fetchBooks();
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap");

.container {
  background-color: #f9f9f9;
  padding-top: 2rem;
  font-family: "Roboto", sans-serif;
}

.card {
  background: #ffffff;
  border-radius: 0.75rem;
  overflow: hidden;
  border: 1px solid #ddd;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  height: 400px;
  display: flex;
  flex-direction: column;
}

.card-img-top {
  height: 200px;
  object-fit: cover;
}

.card-body {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.card-title {
  font-size: 1.25rem;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-title:hover {
  cursor: pointer;
}

.card-subtitle {
  font-size: 1rem;
  color: #666;
}

.card-text {
  font-size: 0.875rem;
  color: #555;
  overflow: hidden;
}

.author-text {
  display: block;
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  position: relative;
}

.author-text:hover::after {
  content: attr(title);
  position: absolute;
  left: 0;
  top: 100%;
  background-color: #333;
  color: #fff;
  padding: 0.5rem;
  border-radius: 0.375rem;
  white-space: nowrap;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
}

.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
  color: #ffffff;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
}

.btn-primary:hover {
  background-color: #0056b3;
  border-color: #004085;
}

.dropdown-toggle::after {
  display: none;
}

.filter-dropdown {
  position: relative;
  margin-left: auto;
}

.btn-filter {
  background-color: #007bff;
  color: #ffffff;
  border-radius: 0.375rem;
}

.btn-filter:hover {
  background-color: #0056b3;
}

.dropdown-menu {
  border-radius: 0.375rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #007bff;
}

.dropdown-item {
  cursor: pointer;
  font-size: 0.875rem;
  color: #ffffff;
}

.dropdown-item:hover {
  background-color: #0056b3;
}

.btn-pagination {
  background-color: #007bff;
  border-color: #007bff;
  color: #ffffff;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
}

.btn-pagination:disabled {
  background-color: #e9ecef;
  border-color: #e9ecef;
  color: #6c757d;
}

.d-flex.justify-content-between.align-items-center {
  margin-bottom: 1rem;
}

.current-page {
  font-size: 1rem;
  color: #333;
  font-weight: 500;
  margin: 0 1rem;
}

.page-info {
  font-size: 1rem;
  color: #333;
  font-weight: 500;
  margin: 0 1rem;
}
</style>
