<template>
  <div class="top-layout">
    <el-container>
      <el-aside class="top-side">
        <countrytitle />
        <peaceprocess v-on:sendData="getData" :ppArr="ppArr"/>
      </el-aside>

      <el-main class="top-main">
        <countrymetrics :processNum="processNum" :agtNum="agtNum" :actorNum="actorNum" :timespan="timespan" />
        <timeline :data="data"/>
      </el-main>
    </el-container>
  </div>

  <div class="process-layout">
    <ppdashbord :data="data"/>
  </div>

</template>

<script>
  import peaceprocess from '../components/peaceprocess.vue'
  import countrytitle from '../components/countrytitle.vue'
  import timeline from '../components/timeline.vue'
  import countrymetrics from '../components/countrymetrics.vue'

  import ppdashbord from '../components/ppdashboard.vue'
  import russia from '../data/russia.json'

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
        this.data = data
      }
    },

    setup() {
      //test
      let x, y, a, b, c, d;
      console.log('\\n')


      var ppArr = [];
      for (let i=0; i<russia.length; i++) {
          var peaceProcess = russia[i].PP;
          if (ppArr.includes(peaceProcess) == false) {
              ppArr.push(peaceProcess);
              i++
          } else {
              i++
          }
      }
      let processNum = ppArr.length

      var agtArr = []
      var agtTimeArr = []
      var agtNum = 0
      var actorArr = []

      for (let i=0; i<russia.length; i++) {
      var agt = russia[i]["From Node (Short Name)"]
      var agtYear = russia[i].date
      var actorName = russia[i]["To Node Name"]

      if (actorArr.includes(actorName) == false) {
        actorArr.push(actorName);
      }

      if (agtArr.includes(agt) == false) {
          agtArr.push(agt);
          agtTimeArr.push(new Date(agtYear))
          agtNum++;
      }
      }

      var maxDate = new Date(Math.max.apply(null, agtTimeArr))
      var maxYear = maxDate.getFullYear()
      var minDate = new Date(Math.min.apply(null, agtTimeArr))
      var minYear = minDate.getFullYear()

      let actorNum = actorArr.length
      let timespan = `${minYear} - ${maxYear}`

      return {
        ppArr, processNum, agtNum, actorNum, timespan
      }

    }
  }

</script>