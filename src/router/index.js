import { createRouter, createWebHistory } from "vue-router";
import BookList from "@/views/BookList.vue";
import BookDetails from "@/components/BookDetails.vue";

const routes = [
  {
    path: "/",
    redirect: "/bookslist",
  },
  {
    path: "/bookslist",
    name: "BooksList",
    component: BookList,
  },
  {
    path: "/book/:id",
    name: "BookDetails",
    component: BookDetails,
    props: true,
  },
  {
    path: "/:catchAll(.*)",
    redirect: "/bookslist",
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
