<template>
  <main>
    <div><img v-lazyload :data-loading="loading" data-src="https://source.unsplash.com/CeWNEEsHPbA"></div>
    <div><img v-lazyload :data-loading="loading" data-src="https://source.unsplash.com/uy5t-CJuIK4"></div>
    <div><img v-lazyload :data-loading="loading" data-src="https://source.unsplash.com/KHBvwAnWFmc"></div>
    <div><img v-lazyload :data-loading="loading" data-src="https://source.unsplash.com/A7nK49HCqSI"></div>
    <div><img v-lazyload :data-loading="loading" data-src="https://source.unsplash.com/XbvtwetXyfw"></div>
    <div><img v-lazyload :data-loading="loading" data-src="https://source.unsplash.com/iqHBu3dBLZU"></div>
    <div><img v-lazyload :data-loading="loading" data-src="https://source.unsplash.com/m_5_YuDRnE0"></div>
    <div><img v-lazyload :data-loading="loading" data-src="https://source.unsplash.com/ljsEHTQoR5M"></div>
    <div><img v-lazyload :data-loading="loading" data-src="https://source.unsplash.com/Sn_eW7KQdoY"></div>
  </main>
</template>

<script>
import loading from './loading.gif'

export default {
  el: '#app',
  data() {
    return {
      loading
    }
  }
}
</script>

<style scoped>
main {
  margin: 5% auto;
  width: 60%;
}

div {
  position: relative;
  padding-top: 66.7%;
}

div + div {
  margin-top: 5%;
}

img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
