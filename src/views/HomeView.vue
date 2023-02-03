<template>
  <div class="top-layout">
    <el-container>
      <el-aside class="top-side" width="35%">
        <countrytitle />
        <peaceprocess v-on:sendData="getData" />
      </el-aside>

      <el-main class="top-main">
        <countrymetrics />
        <timeline />
      </el-main>
    </el-container>
  </div>

  <div class="process-layout">
    <!-- <peaceprocess v-on:sendData="getData" /> -->
    <ppdashbord 
      :data="data"/>
  </div>

</template>

<script>
  import peaceprocess from '../components/peaceprocess.vue'
  import countrytitle from '../components/countrytitle.vue'
  import timeline from '../components/timeline.vue'
  import countrymetrics from '../components/countrymetrics.vue'

  import ppdashbord from '../components/ppdashboard.vue'

  export default {
    components: {peaceprocess, countrytitle, timeline, countrymetrics, ppdashbord},

    data() {
      return {
        ppTitle: '',
        agtNum: 0,
        agtActorNum:0,
        agtTime: '',
        data: {}
      }
    },

    methods: {
      getData(data) {
        console.log("22222222",data)
        // this.ppTitle = data.pp
        // this.agtNum = data.agtNum
        // this.agtActorNum = data.actorNum
        // this.agtTime = data.time

        this.data = data

        // let title = data.pp

        console.log("33333333", this.data)
        // return title
      }
    }
  }

</script>