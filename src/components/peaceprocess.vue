
<template>
    <hr />
    <div class='process-wrapper'>
        <h2>{{selectedProcess}}</h2>
        <div class="selection">
            <el-select 
                id="select1" 
                v-model="selectedProcess" 
                placeholder="Select" 
                size="large"
                @change="renderUpdateNew">
                <el-option
                v-for="(name, i) in selectList"
                :value="selectList[i]"
                />
            </el-select>
        </div>
    </div>


    <div class="parent">
        <div class="div1">
            <h3 class="top-sub">Key Metrics</h3>
            <h3>Summary</h3>
            <div class="metrics-wrapper">
                <p class="metrics-num">{{ agreementNum }}</p>
                <p class="metrics-title">agreements</p>
            </div>
            <div class="metrics-wrapper">
                <p class="metrics-num">{{ actorNum }}</p>
                <p class="metrics-title">actors</p>
            </div>

            <div class="metrics-wrapper">
                <p class="metrics-num">{{ time }}</p>
                <p class="metrics-title">timespan</p>
            </div>
            
        </div>

        <div class="div2">
            <h3 class="top-sub">Legends</h3>
            <h3>Entity and relations</h3>
            <legends />
        </div>
        <div class="div3">
            <div class="network">
            <h3 class="top-sub">Networks</h3>
            <h3>Actors agreement network view</h3>
            <p class="chart-description">
                Forced layout of actor network.
                <br />
                <b>Hover</b> to see name of the dot.
                <br />
                <b>Select</b> to read agreement brief.
             </p>
            <div id="network" style="width: 100%; height: 600px; "></div>
        </div>
        </div>
        <div class="div4">
            <div class="list">
            <h3 class="top-sub">List</h3>
            <h3>Actors list view in each agreement</h3>
            <p class="chart-description">
                List of actors associated to agreements, no particular relationship related.
             </p>
            <div id="list" style="width: 100%; height: 480px; position: relative; left: 50px;"></div>
        </div>
        </div>
        <div class="div5">
            <div class="jigsaw">
            <h3 class="top-sub">Jigsaw</h3>
            <h3>Agreements and Actors in columns</h3>
            <p class="chart-description">
                Agreements ordered by date listed on left column, actors on the right.
             </p>
            <div id="jigsaw" style="width: 100%; position: relative; left: 0px;" ></div>
        </div>
        </div>
    </div>

</template>


<script>

    import russia from "@/data/russia.json"
    import legends from '@/components/legends.vue'

    export default {
        components: { legends },
        
        data() {
            return {
                selectList: this.ppArr,
                agreementNum: 0,
                actorNum: 0,
                time: "",
                selectedProcess: this.ppArr[0]
            }
        },

        methods: {
            agreementNumCounter(selectedProcess) {
                var agtNum = 0;
                var agtArr = [];
        
                for (let i=0; i<russia.length; i++) {
                    if (russia[i].PP == ppName) {
                         var agtName = russia[i]["From Node (Short Name)"];
                        if (agtArr.includes(agtName) == false) {
                            agtArr.push({agt: agtName, agtYear: russia[i].date});
                            agtNum++;
                        }
                    }
                }

                return agtNum;
            },


            renderUpdateNew() {
                var select = this.selectedProcess
                console.log("use in variable" + select);
                console.log(russia[0].PP);

                NetPanoramaTemplateViewer.render(`..${__webpack_public_path__}templates/network.json`, {
                    fileUrl: `"..${__webpack_public_path__}data/russia.json"`,
                    peaceProcess: `'${select}'`
                    }, "network");

                NetPanoramaTemplateViewer.render(`..${__webpack_public_path__}templates/jigsaw.json`, {
                    fileUrl: `"..${__webpack_public_path__}data/russia.json"`,
                    peaceProcess: `'${select}'`
                    }, "jigsaw");

                NetPanoramaTemplateViewer.render(`..${__webpack_public_path__}templates/list.json`, {
                    fileUrl: `"..${__webpack_public_path__}data/russia.json"`,
                    peaceProcess: `'${select}'`
                    }, "list");

                NetPanoramaTemplateViewer.render(`..${__webpack_public_path__}templates/timeline.json`, {
                    fileUrl: `"..${__webpack_public_path__}data/russia.json"`,
                    peaceProcess: `'${select}'`
                    }, "timeline");

                var agtArr = [];
                var agtYearArr = [];
        
                for (let i=0; i<russia.length; i++) {
                    if (russia[i].PP == select) {
                        var agtName = russia[i]["From Node (Short Name)"];
                        if (agtArr.includes(agtName) == false) {
                            agtArr.push(agtName);
                            agtYearArr.push(new Date(russia[i].date));
                        }
                    }
                }

                var actArr = [];

                for (let i=0; i<russia.length; i++) {
                    if (russia[i].PP == select) {
                        var actorName = russia[i]["To Node Name"];
                        if (actArr.includes(actorName) == false) {
                            actArr.push(actorName);
                        }
                    }
                }

                this.agreementNum = agtArr.length;
                this.actorNum = actArr.length;

                var maxDate = new Date(Math.max.apply(null, agtYearArr));
                var maxYear = maxDate.getFullYear();
                var minDate = new Date(Math.min.apply(null, agtYearArr));
                var minYear = minDate.getFullYear();

                this.time = `${minYear} - ${maxYear}`;
            }
        },

        mounted() {
          this.renderUpdateNew()  
        },

        setup() {
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
            console.log("@@@@@@@",__webpack_public_path__, `..${__webpack_public_path__}templates/timeline.json`, `..${__webpack_public_path__}data/russia.json`)

            return {
                ppArr
            }
        }
    }

</script>