// store/index.js
import { defineStore } from 'pinia'

export const useMyStore = defineStore('myStore', {
    state: () => ({
        paramsArray: [],
      }),
      actions: {
        setParams(params) {
            this.paramsArray = params
        },
        getParams() {
          return this.paramsArray
        },
      },
})
