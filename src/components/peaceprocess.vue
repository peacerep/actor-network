
<template>
    <div class='selector-wrapper'>
        <p class="selector-title">To begin, select a Peace Process to show relevant agreements in which {{ country }} has been involved:</p>
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
    let view1, view2, view3, view4

    export default {
        emits:["sendData"],

        props:["country","dataPath", "countryData", "ppArr", "actorTypeLegendList","actorTypeLegendListNetwork", "colorRange", "colorRangeNetwork", "sigColorRange", "agtColor", "timespanArr"],
        
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
                // selectedProcess: '',

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
                // AUTO SIZING
                var jigsawWidth = this.jigsawW
                var jigsawHeight = this.jigsawH
                var networkWidth = this.networkW
                var networkHeight = this.networkH
                var listWidth = this.listW
                var listHeight = this.listH
                var timelineWidth = this.timelineW
                var timelineHeight = this.timelineH
                var timelinebar = this.barWidth

                var country = this.country
                var dataPath = this.dataPath

                console.log("fetch timespanArr", this.timespanArr)
                var timespanArr = JSON.stringify(this.timespanArr)

                // legends for network and jigsaw
                var actorTypeLegendListNetwork = JSON.stringify(this.actorTypeLegendListNetwork)
                var colorRangeNetwork = JSON.stringify(this.colorRangeNetwork)
                // legends for list
                var actorTypeLegendList = JSON.stringify(this.actorTypeLegendList)
                var colorRange = JSON.stringify(this.colorRange)
                // legends for links
                var sigColorRange = JSON.stringify(this.sigColorRange)
                var agtColor = JSON.stringify(this.agtColor)

                // see NetPan usage, read in data path, add template variables, and interaction listeners
                view1 = await NetPanoramaTemplateViewer.render(`..${__webpack_public_path__}templates/network.json`, {
                    fileUrl: `"..${__webpack_public_path__}data/${dataPath}"`,
                    peaceProcess: `'${select}'`,
                    autoWidth: `${networkWidth}`,
                    autoHeight: `${networkHeight}`,
                    actorTypeLegendList: `${actorTypeLegendListNetwork}`,
                    colorRange: `${colorRangeNetwork}`,
                    sigColorRange: `${sigColorRange}`,
                    country:`'${country}'`
                    }, "network",
                    {paramCallbacks: {selected_node: this.linkNodes}});

                view2 = await NetPanoramaTemplateViewer.render(`..${__webpack_public_path__}templates/jigsaw.json`, {
                    fileUrl: `"..${__webpack_public_path__}data/${dataPath}"`,
                    peaceProcess: `'${select}'`,
                    autoWidth: `${jigsawWidth}`,
                    autoHeight: `${jigsawHeight}`,
                    actorTypeLegendList: `${actorTypeLegendListNetwork}`,
                    colorRange: `${colorRangeNetwork}`,
                    sigColorRange: `${sigColorRange}`,
                    country:`'${country}'`
                    }, "jigsaw",
                    {paramCallbacks: {selected_node: this.linkNodes}});

                view3 = await NetPanoramaTemplateViewer.render(`..${__webpack_public_path__}templates/list.json`, {
                    fileUrl: `"..${__webpack_public_path__}data/${dataPath}"`,
                    peaceProcess: `'${select}'`,
                    autoWidth: `${listWidth}`,
                    autoHeight: `${listHeight}`,
                    actorTypeLegendList: `${actorTypeLegendList}`,
                    colorRange: `${colorRange}`,
                    country:`'${country}'`
                    }, "list");

                view4 = await NetPanoramaTemplateViewer.render(`..${__webpack_public_path__}templates/timeline.json`, {
                    fileUrl: `"..${__webpack_public_path__}data/${dataPath}"`,
                    peaceProcess: `'${select}'`,
                    autoWidth: `${timelineWidth}`,
                    autoHeight: `${timelineHeight}`,
                    barWidth: `${timelinebar}`,
                    agtColor: `${agtColor}`,
                    timespanArr: `${timespanArr}`
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

                // loop over each row in entire data
                for (let i=0; i<this.countryData.length; i++) {
                    // get only data from selected peace process
                    if (this.countryData[i]["PPName"] == select) {
                        var agtID = this.countryData[i]["AgtId"]
                        var fullName = this.countryData[i]["Agt"]
                        var actorName = this.countryData[i]["actor_name"]

                        if (agtArr.includes(agtID) == false) {
                            agtArr.push(agtID)

                            // new Date() parse string in "2000-01-01"
                            // agtYearArr.push(new Date(countryData[i].date))

                            // uk agt date in "dd/mm/yyyy" format
                            const parts = this.countryData[i].date.split('/');
                            let dateObj = new Date(parts[2], parts[1] - 1, parts[0]);
                            agtYearArr.push(dateObj)

                            //actorsInAgt: for network full view, get agt: {attributes}
                            actorsInAgt.push({
                                id: agtID,
                                name: fullName,  
                                date:this.countryData[i].date,
                                link: this.countryData[i].PAX_Hyperlink, 
                                stage: this.countryData[i]["stage_label"], 
                                description: this.countryData[i].description, 
                                actorList: [actorName],
                                actortypeList: [{actor: actorName, edge: this.countryData[i]["signatory_type"],
                                type: this.countryData[i]["actor_type"]}]})
                        }
                        else {
                            for (let item of actorsInAgt) {
                                if (item.id == agtID) {
                                    if (item.actorList.includes(actorName) == false) {
                                        item.actorList.push(actorName)
                                        item.actortypeList.push({
                                            actor: this.countryData[i]["actor_name"], 
                                            edge: this.countryData[i]["signatory_type"], 
                                            type: this.countryData[i]["actor_type"]})
                                    }
                                }
                            }
                        }
                        
                        if (actArr.includes(actorName) == false) {
                            actArr.push(actorName);
                            //actorSignedAgreements: for network full view, get actor: {signed agreements}
                            actorSignedAgreements.push({ 
                                name: actorName,
                                agtList: [{ name: fullName, edge: this.countryData[i]["signatory_type"], date: this.countryData[i].date}]  
                                })
                        }
                        else {
                            for (let item of actorSignedAgreements) {
                                if ( item.name == actorName) {
                                    item.agtList.push({ name: fullName, edge: this.countryData[i]["signatory_type"], date: this.countryData[i].date})
                                }
                            }
                        }
                    }
                }

                console.log("Actors in Agt", actorsInAgt)

                // for adjusting list height
                this.maxNum = 0
                var actorMax = 0
                for (let agt of actorsInAgt) {
                    let actNum = agt.actorList.length
                    if ( actNum >= actorMax) {
                        actorMax = actNum
                    }
                }
                this.maxNum = actorMax

                // for peace process metrics data
                this.agreementNum = agtArr.length
                this.actorNum = actArr.length
                var maxDate = new Date(Math.max.apply(null, agtYearArr));
                var maxYear = maxDate.getFullYear();
                var minDate = new Date(Math.min.apply(null, agtYearArr));
                var minYear = minDate.getFullYear();
                this.time = `${minYear} - ${maxYear}`;

                //emit to parent
                let emitArr = {
                    "pp": this.selectedProcess, 
                    "agtNum": agtArr.length, 
                    "actorNum": actArr.length, 
                    "time": `${minYear} - ${maxYear}`, 
                    // for network full view
                    "actorList": actorsInAgt, 
                    "actors": actorSignedAgreements, 
                    "maxNum": actorMax 
                }
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
                // for testing out clicks
                // console.log({nodeIds: nodeIds, linkIds: linkIds})
                
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


            setTimeout(() => {
                // console.log("mounted", this.selectedProcess)
                // console.log("test", this.ppArr[0])
                this.selectedProcess = this.ppArr[0]
                this.getMetrics()
                this.render()
            }, 200);
            
            //in async await
            window.addEventListener('resize', this.debounce(this.render, 150))

        }
    }

</script>