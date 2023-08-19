<template>
  <div class="top-layout">
    <el-container>
      <el-aside class="top-side">
        <countrytitle />
        <peaceprocess
          :countryData="countryData" 
          v-on:sendData="getData" 
          :ppArr="ppArr" 
          :actorTypeLegendList="actorTypeLegendList" 
          :colorRange="colorRange"
          :actorTypeLegendListNetwork="actorTypeLegendListNetwork"
          :colorRangeNetwork="colorRangeNetwork"
          />
      </el-aside>

      <el-main class="top-main">
        <countrymetrics :processNum="processNum" :agtNum="agtNum" :actorNum="actorNum" :timespan="timespan" />
        <timeline :data="data"/>
      </el-main>
    </el-container>
  </div>

  <div class="process-layout">
    <ppdashbord 
      :data="data" 
      :actorTypeLegendList="actorTypeLegendList" 
      :colorRange="colorRange"
      :actorTypeLegendListNetwork="actorTypeLegendListNetwork"
      :colorRangeNetwork="colorRangeNetwork"
      />
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
        data: {},
        countryData
      }
    },

    methods: {
      getData(data) {
        this.data = data
      }
    },

    setup() {
      // 1. Calculate country metrics
      // countryData is directly imported

      // count peace processes
      var ppArr = [];
      for (let i=0; i<countryData.length; i++) {
          var peaceProcess = countryData[i]["PPName"];
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
      // for legends
      var actorTypeLegendList = []

      for (let i=0; i<countryData.length; i++) {
        var agt = countryData[i]["AgtId"]
        var actorType = countryData[i]["old_actor_type"]

        // The Russia agt date format is 1999/06/10, while the UK agt date is 10/06/1996
        // var agtYear = countryData[i].date
        var date = countryData[i].date;
        var dateParts = date.split("/");
        var agtYear = dateParts[2];

        // count all actors
        var actorName = countryData[i]["actor"]
        if (actorArr.includes(actorName) == false) {
          actorArr.push(actorName);
        }
        var actorNum = actorArr.length

        // count all agreements and time range
        if (agtArr.includes(agt) == false) {
            agtArr.push(agt);
            agtTimeArr.push(new Date(agtYear))
            agtNum++;
        }

        // get all actor types, pass it to "peaceprocess", "ppdashboard", "legends"
        if (actorTypeLegendList.includes(actorType) == false) {
          actorTypeLegendList.push(actorType)
        }
      }

      var colorRange = [
                  "#EAC05B", "#D97144", "#E8A5D5",
                  "#7FAADC", "#714FBA", "#9EB449",
                  "#CEAC9D", "#F6F5BF", "#568AA4",
                  "#44E4DB", "#BA4B80", "#CDD2CC",
                  "#9793AA"
                  ]
      
      // for network, jigsaw rendering
      var actorTypeLegendListNetwork = actorTypeLegendList.slice()
      actorTypeLegendListNetwork.unshift("Peace Agreement");
      var colorRangeNetwork = colorRange.slice()
      colorRangeNetwork.unshift("#60A18B");

      var maxDate = new Date(Math.max.apply(null, agtTimeArr))
      var maxYear = maxDate.getFullYear()
      var minDate = new Date(Math.min.apply(null, agtTimeArr))
      var minYear = minDate.getFullYear()
      let timespan = `${minYear} - ${maxYear}`

      return {
        ppArr, processNum, agtNum, actorNum, timespan, actorTypeLegendList, colorRange, actorTypeLegendListNetwork, colorRangeNetwork
      }

    }
  }

</script>