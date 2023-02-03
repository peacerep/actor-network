
<template>

    <div class='selector-wrapper'>
        <p class="selector-title">Choose a peace process to start:</p>
        <div class="selection">
            <el-select 
                id="select1" 
                v-model="selectedProcess" 
                placeholder="Select" 
                size="large"
                @change="render(); getMetrics()">
                <el-option
                v-for="name in selectList"
                :value="name"
                />
            </el-select>
        </div>
    </div>
</template>


<script>
    import russia from "@/data/russia.json"

    export default {
        emits:["sendData"],
        
        data() {
            return {
                //for the selection box
                selectList: this.ppArr,

                //for display titles
                agreementNum: 0,
                actorNum: 0,
                time: "",
                selectedProcess: this.ppArr[0],

                //for resizing the dashboards
                jigsawW: 0,
                jigsawH: 0,
                networkW: 0,
                networkH: 0,
                listW: 0,
                listH: 0,
                timelineW: 0,
                timelineH: 0,
                barWidth: 0
            }
        },

        methods: {
            renderUpdateNew() {
                return new Promise( resolve => {
                    setTimeout(() => {
                        var select = this.selectedProcess

                        //AUTO SIZING
                        var jigsawWidth = this.jigsawW
                        var jigsawHeight = this.jigsawH
                        var networkWidth = this.networkW
                        var networkHeight = this.networkH
                        var listWidth = this.listW
                        var listHeight = this.listH
                        var timelineWidth = this.timelineW
                        var timelineHeight = this.timelineH
                        var timelinebar = this.barWidth

                        NetPanoramaTemplateViewer.render(`..${__webpack_public_path__}templates/network.json`, {
                            fileUrl: `"..${__webpack_public_path__}data/russia.json"`,
                            peaceProcess: `'${select}'`,
                            autoWidth: `${networkWidth}`,
                            autoHeight: `${networkHeight}`
                            }, "network");

                        NetPanoramaTemplateViewer.render(`..${__webpack_public_path__}templates/jigsaw.json`, {
                            fileUrl: `"..${__webpack_public_path__}data/russia.json"`,
                            peaceProcess: `'${select}'`,
                            autoWidth: `${jigsawWidth}`,
                            autoHeight: `${jigsawHeight}`
                            }, "jigsaw");

                        NetPanoramaTemplateViewer.render(`..${__webpack_public_path__}templates/list.json`, {
                            fileUrl: `"..${__webpack_public_path__}data/russia.json"`,
                            peaceProcess: `'${select}'`,
                            autoWidth: `${listWidth}`,
                            autoHeight: `${listHeight}`
                            }, "list");

                        NetPanoramaTemplateViewer.render(`..${__webpack_public_path__}templates/timeline.json`, {
                            fileUrl: `"..${__webpack_public_path__}data/russia.json"`,
                            peaceProcess: `'${select}'`,
                            autoWidth: `${timelineWidth}`,
                            autoHeight: `${timelineHeight}`,
                            barWidth: `${timelinebar}`,
                            }, "timeline");

                        console.log("RENDERED")
                    }, 50)
                resolve('done')
                })
                
            },

            queryElement(){
                return new Promise (resolve => {
                    setTimeout(() => {
                        let mapElement = document.querySelectorAll("#mapDiv")
                        for (let element of mapElement) {
                            element.remove()
                        }

                        let tooltipElement = document.querySelectorAll('div[style*="z-index: 3;"]')
                        for (let tooltip of tooltipElement){
                            tooltip.className="tooltip-disable"
                        }
                    }, 100)
                    resolve('done')
                })
            },

            async render(){
                await this.getChartSize();
                await this.renderUpdateNew();
                await this.queryElement();
            },

            getMetrics() {
                var select = this.selectedProcess
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

                //emit to parent
                let emitArr = {"pp": this.selectedProcess, "agtNum": agtArr.length, "actorNum": actArr.length, "time": `${minYear} - ${maxYear}` }
                console.log("11111111111",emitArr)
                this.$emit("sendData", emitArr)
            },

            getChartSize() {
                return new Promise (resolve => {
                    setTimeout(() => {
                    //get gird size
                    let grid3 = document.querySelector('.div3')
                    let grid4 = document.querySelector('.div4')
                    let grid5 = document.querySelector('.div5')
                    let timeline = document.querySelector('.timeline')
                    
                    let titleNetwork = document.querySelector('.div3 .title')
                    let titleList = document.querySelector('.div4 .title')
                    let titleJigsaw = document.querySelector('.div5 .title')

                    //get container size
                    let jigsawContainerWidth = grid5.offsetWidth
                    let jigsawContainerHeight = grid5.offsetHeight - titleJigsaw.offsetHeight
                    let networkContainerWidth = grid3.offsetWidth
                    let networkContainerHeight = grid3.offsetHeight - titleNetwork.offsetHeight
                    let listContainerWidth = grid4.offsetWidth
                    let listContainerHeight = grid4.offsetHeight - titleList.offsetHeight

                    //define chart size
                    this.networkW = networkContainerWidth - 40
                    this.networkH = networkContainerHeight - 30
                    this.jigsawW = jigsawContainerWidth - 330
                    this.jigsawH = jigsawContainerHeight - 30
                    this.listW = listContainerWidth - 170
                    this.listH = listContainerHeight - 30
                    
                    this.timelineW = timeline.offsetWidth
                    this.timelineH = timeline.offsetHeight
                    console.log(this.timelineW, this.timelineH)

                    //get timeline bar width and scale domain
                    var timeText = document.getElementById('timespan').innerHTML
                    var oldDate = timeText.slice(0, 4)
                    oldDate = parseInt(oldDate)
                    var newDate = timeText.slice(6, 11)
                    newDate = parseInt(newDate)
                    var yearArr = []
                    for (let i = oldDate; i <= newDate; i++) {
                        yearArr.push(i)
                    }
                    let yearNum = yearArr.length
                    this.barWidth = this.timelineW / yearNum

                    //template for all charts
                    // chart = document.querySelector('.chart')
                    // chartContainerWidth = chart.offsetWidth
                    // chartContainerHeight = chart.offsetHeight

                }, 10)
                    resolve('done')
                })
            },

            debounce(operate, delay) {
                let time = null
                let timer = null
                let newTime = null
                function task() {
                    newTime = +new Date()
                    if( newTime - time < delay ){
                        timer = setTimeout(task, delay)
                    }
                    else {
                        operate()
                        timer = null
                    }
                    time = newTime
                }
                return function () {
                    time = +new Date()
                    if(!timer){
                        timer = setTimeout(task, delay)
                    }
                }
            }
        },

        mounted() {
            this.getMetrics()
            this.render()

            //original resize methods
            // window.addEventListener('resize', this.debounce(this.getChartSize, 150), false)
            // window.addEventListener('resize', this.debounce(this.renderUpdateNew, 150), false)

            //in async await
            window.addEventListener('resize', this.debounce(this.render, 150), false)
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

            return {
                ppArr
            }
        }
    }

</script>