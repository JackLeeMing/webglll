import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/About.vue")
    },
    {
      path: "/about2",
      name: "home2",
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/About2.vue")
    },
    {
      path: "/raw",
      name: "Raw",
      component: () => import(/* webpackChunkName: "about" */ "./views/Raw.vue")
    },
    {
      path: "/about3",
      name: "Translate",
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/Translate.vue")
    },
    {
      path: "/rotate",
      name: "Rotate",
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/Rotate.vue")
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: Home
    },
    {
      path: "/matrix",
      name: "Matrix",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/Matrix.vue")
    }
  ]
});
