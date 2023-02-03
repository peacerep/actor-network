<template>

    <div class="component-container">
        <div>
            <h3 class="top-sub">Key Metrics</h3>
            <h3>Country Summary</h3>
        </div>

    <!-- ELEMENT ROW -->
    <div class="metrics-container">
    <el-row class="top-metrics-row" :gutter="25">
        <el-col :span="5"><div class="grid-content">
            <p class="metrics-num">{{ processNum }}</p>
            <p class="metrics-title">peace process</p>
        </div></el-col>
        <el-col :span="5"><div class="grid-content">
            <p class="metrics-num">{{ agreementNum }}</p>
            <p class="metrics-title">agreements</p>
        </div></el-col>
        <el-col :span="5"><div class="grid-content">
            <p class="metrics-num">{{ agreementNum }}</p>
            <p class="metrics-title">Actors</p>
        </div></el-col>
        <el-col :span="7"><div class="grid-content">
            <p class="metrics-num" id="timespan">{{ timespan }}</p>
            <p class="metrics-title">timespan</p>
        </div></el-col>
    </el-row>
    </div>

    </div>
</template>

<script>
    import russia from '../data/russia.json'
    
    export default {
        data() {
            return {
                processNum: 0,
                agreementNum: 0,
                timespan: ""
            }
        },

        mounted() {
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
            this.processNum = ppArr.length;

            var agtArr = [];
            var agtTimeArr = [];
            var agtNum = 0;
            for (let i=0; i<russia.length; i++) {
            var agt = russia[i]["From Node (Short Name)"];
            var agtYear = russia[i].date;
            if (agtArr.includes(agt) == false) {
                agtArr.push(agt);
                agtTimeArr.push(new Date(agtYear));
                agtNum++;
            }
            }
            var maxDate = new Date(Math.max.apply(null, agtTimeArr));
            var maxYear = maxDate.getFullYear();
            var minDate = new Date(Math.min.apply(null, agtTimeArr));
            var minYear = minDate.getFullYear();

            this.agreementNum = agtNum;
            this.timespan = `${minYear} - ${maxYear}`;

        }
    }
</script>


<style scoped>
</style>