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
  import countryData from '../data/uk.json'

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
      for (let i=0; i<countryData.length; i++) {
          var peaceProcess = countryData[i].PP;
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

      for (let i=0; i<countryData.length; i++) {

      // var agt = countryData[i]["From Node (Short Name)"]
      var agt = countryData[i]["AgtId"]


      // The Russia agt date format is 1999/06/10, while the UK agt date is 10/06/1996
      // var agtYear = countryData[i].date
      var date = countryData[i].date;
      var dateParts = date.split("/");
      var agtYear = dateParts[2];

      var actorName = countryData[i]["To Node Name"]

      if (actorArr.includes(actorName) == false) {
        actorArr.push(actorName);
      }

      if (agtArr.includes(agt) == false) {
          agtArr.push(agt);
          agtTimeArr.push(new Date(agtYear))
          agtNum++;
      }
      }

      console.log("agtArr", agtArr)

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