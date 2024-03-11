// store/index.js
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
  }),
  actions: {
    increment() {
      this.count++
    },
    decrement() {
      this.count--
    },
  },
  getters: {
    getCount() {
      return 100
    },
  },
})


export default defineNuxtPlugin(() => {})
