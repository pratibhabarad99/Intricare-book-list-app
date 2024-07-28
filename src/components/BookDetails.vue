<template>
  <div class="container mt-5">
    <div v-if="loading" class="text-center">
      <div class="spinner-border text-primary" role="status"></div>
      <div class="sr-only">Loading...</div>
    </div>
    <div v-if="error" class="alert alert-danger">{{ error }}</div>
    <div v-else>
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card shadow-lg border-0">
            <img
              :src="book.imageLinks?.thumbnail"
              class="card-img-top"
              alt="Book cover"
            />
            <div class="card-body">
              <h5 class="card-title">{{ book.title }}</h5>
              <h6 class="card-subtitle mb-3">{{ book.subtitle }}</h6>
              <p class="card-text">
                <strong>Authors:</strong> {{ authors.join(", ") }}<br />
                <strong>Publisher:</strong> {{ book.publisher }}<br />
                <strong>Published Date:</strong>
                {{ new Date(book.publishedDate).toLocaleDateString() }}<br />
                <strong>Description:</strong> <br />
                <span
                  v-html="
                    book.description || '<em>No description available.</em>'
                  "
                ></span>
              </p>
              <router-link to="/" class="btn btn-primary">
                Back to List
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      book: {},
      authors: [],
      error: "",
      loading: true,
    };
  },
  methods: {
    async fetchBookDetails() {
      this.loading = true;
      try {
        const bookId = this.$route.params.id;
        const response = await fetch(
          `https://www.googleapis.com/books/v1/volumes/${bookId}`
        );
        const data = await response.json();
        this.book = data.volumeInfo;
        this.authors = this.book.authors || [];
        this.loading = false;
      } catch (err) {
        this.error = "Failed to fetch book details. Please try again later.";
        this.loading = false;
      }
    },
  },
  created() {
    this.fetchBookDetails();
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap");

.container {
  background-color: #f7f9fc;
  padding-top: 2rem;
  font-family: "Roboto", sans-serif;
}

.card {
  background: #ffffff;
  border-radius: 1rem;
  overflow: hidden;
  border: none;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.card-img-top {
  height: 300px;
  object-fit: cover;
}

.card-body {
  padding: 2rem;
  background: linear-gradient(
    135deg,
    #ffffff,
    #f0f2f5
  );
}

.card-title {
  font-weight: 700;
  color: #333333;
  font-size: 1.75rem;
}

.card-subtitle {
  color: #007bff;
  font-size: 1.25rem;
  margin-bottom: 1rem;
}

.card-text {
  color: #555555;
  line-height: 1.8;
}

.btn-primary {
  background-color: #28a745;
  border-color: #28a745;
  color: #ffffff;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-weight: 500;
  font-size: 1rem;
}

.btn-primary:hover {
  background-color: #218838;
  border-color: #1e7e34;
}

.btn-primary:focus,
.btn-primary.focus {
  box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.5);
}
</style>
