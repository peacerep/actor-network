<template>
  <div class="top-layout">
    <el-container>
      <el-aside class="top-side">
        <countrytitle :country="country" />
        <peaceprocess
          :country="country"
          :dataPath="dataPath"
          :countryData="countryData" 
          v-on:sendData="getData" 
          :ppArr="ppArr" 
          :timespanArr="timespanArr"
          :actorTypeLegendList="actorTypeLegendList" 
          :colorRange="colorRange"
          :actorTypeLegendListNetwork="actorTypeLegendListNetwork"
          :colorRangeNetwork="colorRangeNetwork"
          :sigColorRange="sigColorRange"
          :agtColor="agtColor"
          />
      </el-aside>

      <el-main class="top-main">
        <countrymetrics :processNum="processNum" :agtNum="agtNum" :actorNum="actorNum" :timespan="timespan" />
        <timeline :data="data" :agtColor="agtColor" :timespan="timespan"/>
      </el-main>
    </el-container>
  </div>

  <div class="process-layout">
    <ppdashbord 
      :country="country"
      :dataPath="dataPath"
      :data="data"
      :actorTypeLegendList="actorTypeLegendList" 
      :colorRange="colorRange"
      :actorTypeLegendListNetwork="actorTypeLegendListNetwork"
      :colorRangeNetwork="colorRangeNetwork"
      :sigColorRange="sigColorRange"
      :agtColor="agtColor"
      />
  </div>

</template>

<script>
  import peaceprocess from '../components/peaceprocess.vue'
  import countrytitle from '../components/countrytitle.vue'
  import timeline from '../components/timeline.vue'
  import countrymetrics from '../components/countrymetrics.vue'
  import ppdashbord from '../components/ppdashboard.vue'

  import countryData from '../data/RUS_agt.json'

  export default {
    components: {peaceprocess, countrytitle, timeline, countrymetrics, ppdashbord},

    data() {
      return {
        ppTitle: '',
        agtNum: 0,
        agtActorNum:0,
        agtTime: '',
        data: {},
        countryData,
        country: "Russia",
        dataPath: "RUS_agt.json"
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
        var actorType = countryData[i]["actor_type"]

        // The Russia agt date format is 1999/06/10, while the UK agt date is 10/06/1996
        // var agtYear = countryData[i].date
        var date = countryData[i].date;
        var dateParts = date.split("/");
        var agtYear = dateParts[2];

        // count all actors
        var actorName = countryData[i]["actor_name"]
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

      //Jinrui color
      // var colorRange = [
      //             "#EAC05B", "#D97144", "#E8A5D5",
      //             "#7FAADC", "#714FBA", "#9EB449",
      //             "#CEAC9D", "#F6F5BF", "#568AA4",
      //             "#44E4DB", "#BA4B80", "#CDD2CC",
      //             "#9793AA"
      //             ]
      // var sigColorRange = ["#C1C1C1","lightgrey"]
      // var agtColor = "#60A18B"

      // Unified colours
      var colorRange = [
                  "#198038", "#2980B9", "#FF7F0E",
                  "#03A9F4", "#D62728", "#9467BD",
                  "#BCBD22", "#F1C40F", "#E377C2",
                  "#44E4DB"
                  ]
      var sigColorRange = ["#657585", "#F4A425"]
      var agtColor = "#34495E"
      
      // for network, jigsaw rendering
      var actorTypeLegendListNetwork = actorTypeLegendList.slice()
      actorTypeLegendListNetwork.unshift("Peace Agreement");
      var colorRangeNetwork = colorRange.slice()
      colorRangeNetwork.unshift(agtColor);

      var maxDate = new Date(Math.max.apply(null, agtTimeArr))
      var maxYear = maxDate.getFullYear()
      var minDate = new Date(Math.min.apply(null, agtTimeArr))
      var minYear = minDate.getFullYear()
      let timespan = `${minYear} - ${maxYear}`

      let timespanArr = [];

      for (let year = minYear; year <= maxYear; year++) {
          timespanArr.push({"year": year});
      }

      console.log(timespanArr);

      return {
        ppArr, processNum, agtNum, actorNum, timespan, actorTypeLegendList, colorRange, actorTypeLegendListNetwork, colorRangeNetwork, sigColorRange, agtColor, timespanArr
      }

    }
  }

</script>