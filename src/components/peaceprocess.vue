
<template>
    <div class='selector-wrapper'>
        <p class="selector-title">To begin, select a Peace Process to show relevant agreements in which Russia has been involved:</p>
        <div class="selection">
            <el-select 
                id="select1" 
                v-model="selectedProcess" 
                placeholder="Select" 
                size="large"
                @change=" getMetrics(); render();">
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

    let view1, view2, view3, view4

    export default {
        emits:["sendData"],

        props:["ppArr"],
        
        data() {
            return {
                //for the selection box
                selectList: this.ppArr,

                //for display titles
                agreementNum: 0,
                actorNum: 0,
                maxNum: 0,
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
                barWidth: 0,
                listDefaultHeight: 0,
                networkDefaultHeight: 0
            }
        },

        methods: {
            async render(){
                await this.getChartSize();
                await this.renderUpdateNew();
                await this.queryElement();
            },

            async renderUpdateNew() {
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

                        view1 = await NetPanoramaTemplateViewer.render(`..${__webpack_public_path__}templates/network.json`, {
                            fileUrl: `"..${__webpack_public_path__}data/russia.json"`,
                            peaceProcess: `'${select}'`,
                            autoWidth: `${networkWidth}`,
                            autoHeight: `${networkHeight}`
                            }, "network",
                            {paramCallbacks: {selected_node: this.linkNodes}});

                        view2 = await NetPanoramaTemplateViewer.render(`..${__webpack_public_path__}templates/jigsaw.json`, {
                            fileUrl: `"..${__webpack_public_path__}data/russia.json"`,
                            peaceProcess: `'${select}'`,
                            autoWidth: `${jigsawWidth}`,
                            autoHeight: `${jigsawHeight}`
                            }, "jigsaw",
                            {paramCallbacks: {selected_node: this.linkNodes}});

                        view3 = await NetPanoramaTemplateViewer.render(`..${__webpack_public_path__}templates/list.json`, {
                            fileUrl: `"..${__webpack_public_path__}data/russia.json"`,
                            peaceProcess: `'${select}'`,
                            autoWidth: `${listWidth}`,
                            autoHeight: `${listHeight}`
                            }, "list");

                        view4 = await NetPanoramaTemplateViewer.render(`..${__webpack_public_path__}templates/timeline.json`, {
                            fileUrl: `"..${__webpack_public_path__}data/russia.json"`,
                            peaceProcess: `'${select}'`,
                            autoWidth: `${timelineWidth}`,
                            autoHeight: `${timelineHeight}`,
                            barWidth: `${timelinebar}`,
                            }, "timeline",
                            {paramCallbacks: {selected_node: this.linkNodes}});

                        console.log("RENDERED")
                },

            queryElement(){
                return new Promise (resolve => {
                    setTimeout(() => {
                        //remove blank mapDivs
                        let mapElement = document.querySelectorAll("#mapDiv")
                        for (let element of mapElement) {
                            element.remove()
                            element.style.width = "20px"
                            element.style.height = "20px"
                        }
                        //disable text selection on tooltip divs to improve hovering experience
                        let tooltipElement = document.querySelectorAll('div[style*="z-index: 3;"]')
                        for (let tooltip of tooltipElement){
                            tooltip.className="tooltip-disable"
                        }
                    }, 200)
                    resolve('done')
                })
            },

            getChartSize() {
                    //get gird size
                    let parent = document.querySelector('.parent')
                    let grid3 = document.querySelector('.div3')
                    let grid4 = document.querySelector('.div4')
                    let grid5 = document.querySelector('.div5')
                    let timeline = document.querySelector('.timeline')

                    let titleNetwork = document.querySelector('.div3 .title')
                    let titleList = document.querySelector('.div4 .title')
                    let titleJigsaw = document.querySelector('.div5 .title')

                    //calculate List Size
                    const unitHeight = 16
                    var row = Math.ceil(this.maxNum / 16)
                    var listNewHeight = unitHeight * ( this.agreementNum * row)
                    this.listH = listNewHeight + 50

                    // assign streched grid size if list too long
                    let listDivHeight = titleList.offsetHeight + listNewHeight + 50
                    if ( listDivHeight > this.listDefaultHeight) {
                        parent.style.height = `${listDivHeight*2}px`
                        console.log(parent, parent.style.height)
                    }
                    else {
                        parent.style.height = "auto"
                        grid4.style.height = "auto"
                        grid3.style.height = "auto"
                        grid5.style.height = "auto"
                    }

                    //get container size
                    let jigsawContainerWidth = grid5.offsetWidth
                    let jigsawContainerHeight = grid5.offsetHeight - titleJigsaw.offsetHeight
                    let networkContainerWidth = grid3.offsetWidth
                    let networkContainerHeight = grid3.offsetHeight - titleNetwork.offsetHeight
                    let listContainerWidth = grid4.offsetWidth

                    //define chart size
                    this.networkW = networkContainerWidth - 40
                    this.networkH = networkContainerHeight - 90
                    this.jigsawW = jigsawContainerWidth - 340
                    this.jigsawH = jigsawContainerHeight - 50
                    this.listW = listContainerWidth - 300
                    this.timelineW = timeline.offsetWidth - 50
                    this.timelineH = timeline.offsetHeight - 50

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
                }, 


            getMetrics() {
                var select = this.selectedProcess
                var agtArr = []
                var agtYearArr = []
                var actArr = []
                var actorsInAgt = []
                var actorSignedAgreements = []
        
                for (let i=0; i<russia.length; i++) {
                    if (russia[i].PP == select) {
                        var agtName = russia[i]["From Node (Short Name)"]
                        var fullName = russia[i]["From Node (Full Name)"]
                        var actorName = russia[i]["To Node Name"]

                        if (agtArr.includes(fullName) == false) {
                            agtArr.push(fullName)
                            agtYearArr.push(new Date(russia[i].date))
                            
                            //for network full view, get agt: {attributes}
                            actorsInAgt.push({
                                agt: agtName, 
                                name: fullName,  
                                date:russia[i].date,
                                link: russia[i].PAX_Hyperlink, 
                                stage: russia[i]["From Node Sub-Type"], 
                                description: russia[i].agt_description, 
                                actorList: [actorName],
                                actortypeList: [{actor: actorName, edge: russia[i].Edge,type: russia[i]["To Node Sub-Type"]}]})
                        }
                        else {
                            for (let item of actorsInAgt) {
                                if (item.agt == agtName) {
                                    if (item.actorList.includes(actorName) == false) {
                                        item.actorList.push(actorName)
                                        item.actortypeList.push({actor: russia[i]["To Node Name"], edge:russia[i].Edge, type: russia[i]["To Node Sub-Type"]})
                                    }
                                }
                            }
                        }
                        
                        if (actArr.includes(actorName) == false) {
                            actArr.push(actorName);
                            //for network full view, get actor: {signed agreements}
                            actorSignedAgreements.push({ 
                                name: actorName,
                                agtList: [{ name: fullName, edge: russia[i].Edge, date: russia[i].date}]  
                                })
                        }
                        else {
                            for (let item of actorSignedAgreements) {
                                if ( item.name == actorName) {
                                    item.agtList.push({ name: fullName, edge: russia[i].Edge, date: russia[i].date})
                                }
                            }
                        }
                    }
                }

                this.maxNum = 0
                var actorMax = 0
                for (let agt of actorsInAgt) {
                    let actNum = agt.actorList.length
                    // console.log("ACTORS", {agt: agt, actors: actorsInAgt})
                    if ( actNum >= actorMax) {
                        actorMax = actNum
                    }
                }

                this.maxNum = actorMax
                this.agreementNum = agtArr.length
                this.actorNum = actArr.length

                var maxDate = new Date(Math.max.apply(null, agtYearArr));
                var maxYear = maxDate.getFullYear();
                var minDate = new Date(Math.min.apply(null, agtYearArr));
                var minYear = minDate.getFullYear();

                this.time = `${minYear} - ${maxYear}`;

                //emit to parent
                let emitArr = {"pp": this.selectedProcess, "agtNum": agtArr.length, "actorNum": actArr.length, "time": `${minYear} - ${maxYear}`, "actorList": actorsInAgt, "actors": actorSignedAgreements, "maxNum": actorMax }
                this.$emit("sendData", emitArr)

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
            },

            linkNodes(newVal) {
                this.propogateSelection(view1, "selected_node", newVal)
                this.propogateSelection(view2, "selected_node", newVal)
                this.propogateSelection(view4, "selected_node", newVal)
            },

            propogateSelection(viewer, selectionName, newVal) {
                const nodeIds = newVal.nodes.map(n => n.id)
                const linkIds = newVal.links.map(l => l.id)
                console.log({nodeIds: nodeIds, linkIds: linkIds})
                // the name of the network in which the selection is made - set in specification       
                const networkName = "network"
                const nodes = viewer.state[networkName].nodes.filter(n => nodeIds.includes(n.id))
                const links = viewer.state[networkName].links.filter(l => linkIds.includes(l.id))
                viewer.setParam(selectionName, {nodes, links})
            },


        },

        mounted() {
            //get default height
            let listGrid = document.querySelector('.div4')
            let networkGrid = document.querySelector('.div3')
            let networkGridHeight = networkGrid.offsetHeight
            let listGridHeight = listGrid.offsetHeight
            this.networkDefaultHeight = networkGridHeight
            this.listDefaultHeight = listGridHeight

            this.getMetrics()
            // this.render()

            setTimeout(() => {
                this.render()
            }, 200);
            
            //in async await
            window.addEventListener('resize', this.debounce(this.render, 150))
        }
    }

</script>