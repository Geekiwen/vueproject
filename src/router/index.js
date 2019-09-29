import Vue from 'vue'
import Router from 'vue-router'
import Layout from "../pages/Layout"
import ProductSelect from "../pages/ProductSelect/ProductSelect"
import Params from "../pages/Params/Params"
import ContentCategory from "../pages/ContentCategory/ContentCategory"
import Login from "../pages/Login/Login"
import store from "../store"


Vue.use(Router)
const router = new Router({
  mode: 'history',
  linkActiveClass: 'active',
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      component: Layout,
      children: [
        {
          path: "/",
          name: "ProductSelect",
          component: ProductSelect,
          meta:{
            isLogined:true
          }
        },
        {
          path: "/params",
          name: "Params",
          component: Params,
          meta:{
            isLogined:true
          }
        },
        {
          path: "/content",
          name: "LoContentCategorygin",
          component: ContentCategory,
          meta:{
            isLogined:true
          }
        }
      ]
    },
    {
      path: "/login",
      name: "Login",
      component: Login
    }
  ]
})

router.beforeEach((to, from, next) => {
  if(to.meta.isLogined){
    // 读取token
    const token = store.state.userinfo.token;
    if(token){
      next();
    }else{
      next({
        path:"/login"
      })
    }
  }
  next();
})

export default router