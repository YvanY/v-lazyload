import Vue from 'vue'
import App from './App'
import lazyload from '../src'

Vue.use(lazyload)

new Vue(App) // eslint-disable-line no-new
