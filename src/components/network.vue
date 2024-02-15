<template>
    <div class="dialogue-title-wrapper">
        <h2 class="dialogue-title">{{ title }}</h2>
        <p class="dialogue-description">
            <b>Hover</b> nodes for more information.
            <b>Click</b> to show related nodes.
        </p>
    </div>
    <div class="dialogue-container" id="network-dialog-container">
        <div class="dialogue-legends">
            <h3 class="dialogue-heading">Legend</h3>
            <legends 
                        :actorTypeLegendList="actorTypeLegendList" 
                        :colorRange="colorRange"
                        :sigColorRange="sigColorRange"
                        :agtColor="agtColor"/>
        </div>
        <el-divider v-if="this.w >= 1200" direction="vertical" content-position="center" />
        <el-divider v-else-if="this.w < 1200 && this.w >= 300" content-position="center" />
        <div class="networkFull">
            <div id="networkFull" style="position: relative; "></div>
        </div>
        <el-divider v-if="this.w >= 1200" direction="vertical" content-position="center" />
        <el-divider v-else-if="this.w < 1200 && this.w >= 300" content-position="center" />
        <div class="dialogue-description" id="fix">
            
            <div v-show="agtVisible" class="if-agt-wrapper" >
                <p>Agreement</p>
                <h3 id="agtName"></h3>
                <p class="small" id="date"></p>
                <p class="small" id="stage"></p>
                <el-link class="small" id="link" target="_blank"></el-link>
                <p class="small" id="description"></p>
                
                <h4>All Parties to Agreement:</h4>
                <el-table :data="actorTable" style="width: 100%;">
                    <el-table-column prop="actor" label="Actor" />
                    <el-table-column prop="edge" label="Signatory Type" />
                    <el-table-column prop="type" label="Actor Group" />
                </el-table>
            </div>

            <div v-show="actorVisible" class="if-entity-wrapper">
                <p>Actor</p>
                <h3 id="entityName"></h3>
                <div class="if-entity-list">
                    <p id="actor-info"></p>
                    <h4>Involved agreements:</h4>
                    <div class="dialogue-agreement-list" 
                        v-for="item in this.agtTable" :key="item">
                        <h4>{{ item.name }}</h4>
                        <p class="small">{{ item.date }}</p>
                        <p class="small">Signatory Type: {{ item.edge }}</p>
                        <el-divider />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import legends from '../components/legends.vue'
import actorInfo from '../data/UKG_actor.json'

export default {
    components: { legends },
    props: ["country", "dataPath", "title", "actorList", "agreementList", "actorTypeLegendListNetwork", "colorRangeNetwork", "actorTypeLegendList", "colorRange", "sigColorRange", "agtColor"],

    data() {
        return {
            height: 10,
            width: 10,
            w: 0,
            peaceprocess: '',
            selectedProcess: 'Kosovo process',
            actorTable: [],
            agtTable: [],
            agtVisible: false,
            actorVisible: false
        }  
    },

    methods: {
        getWiddow() {
            var w = window.innerWidth;
            this.w = w
            return w
        },

        fixHeight() {
            const dialogDiv = document.querySelector('#fix')
            dialogDiv.style.height = "70vh"
        },

        //define chart size
        getSize(){
            let networkDiv = document.querySelector('.networkFull')
            let height = networkDiv.offsetHeight
            let width = networkDiv.offsetWidth

            this.height = height - 50
            this.width = width - 50
            },

        //render chart
        renderNetwork() {
            this.getWiddow()
            this.getSize()
            var select = this.title
            var networkWidth = this.width
            var networkHeight = this.height
            var country = this.country
            var dataPath = this.dataPath

            // legends for network
            var actorTypeLegendListNetwork = JSON.stringify(this.actorTypeLegendListNetwork)
            var colorRangeNetwork = JSON.stringify(this.colorRangeNetwork)
            var sigColorRange = JSON.stringify(this.sigColorRange)

            var view1 = NetPanoramaTemplateViewer.render(`..${__webpack_public_path__}templates/network.json`, 
                    {
                        fileUrl: `"..${__webpack_public_path__}data/${dataPath}"`,
                        peaceProcess: `'${select}'`,
                        autoWidth: `${networkWidth}`,
                        autoHeight: `${networkHeight}`,
                        actorTypeLegendList: `${actorTypeLegendListNetwork}`,
                        colorRange: `${colorRangeNetwork}`,
                        sigColorRange: `${sigColorRange}`,
                        country:`'${country}'`
                    }, 
                    "networkFull",
                    {paramCallbacks: {selected_node: this.onChange}}
                    );
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
                    }, 400)
                    resolve('done')
                })
            },

        //click on nodes to shows description panel
        onChange(newVal) {
            if (newVal.nodes.length > 0){
                this.clear()
                const node = newVal.nodes[0]

                //different layout for entity nodes and agreement nodes
                const nodeType = node.data.node_type
                
                if ( nodeType == "signatory") {
                    //if selected node is an actor
                    this.actorVisible = true
                    document.getElementById('entityName').innerText = node.id

                    //loop info table
                    for ( let actor of actorInfo) {
                        if (node.id == actor.actor) {
                            document.getElementById('actor-info').innerText = actor.additional_info
                        }
                    }
                    //loop agreementList for all signed agreements, trace to HomeView to peaceprocess.vue
                    for ( let actor of this.agreementList) {
                        if ( actor.name == node.id ) {
                            this.agtTable = actor.agtList
                        }
                    }
                }

                else if ( nodeType == "Peace Agreement") {
                    //if selected node is an agreement
                    this.agtVisible = true
                    document.getElementById('agtName').innerText = node.id
                    
                    //loop actorList for agreement info, trace to HomeView to peaceprocess.vue
                    for (let agt of this.actorList) {
                        if ( agt.name == node.id ) {
                            this.actorTable = agt.actortypeList
                            console.log("agt actor table", agt.actortypeList)
                            document.getElementById('date').innerText = agt.date
                            document.getElementById('link').href = agt.link
                            document.getElementById('stage').innerText = `Stage: ${agt.stage}`
                            document.getElementById('description').innerText = `Description: ${agt.description}`
                            document.getElementById('link').innerText = "See full text in PA-X"
                        }
                    }
                }
            } 
            else {
                this.clear()
            }
        },

        //clear contents before clicking on blank space or other nodes
        clear() {
            //clear for entities
            this.actorVisible = false
            document.getElementById('entityName').innerText = ""

            //clear for agt
            this.agtVisible = false
            document.getElementById('agtName').innerText = ""
            document.getElementById('date').innerText = ""
            document.getElementById('link').innerText = ""
            document.getElementById('link').href = ""
            document.getElementById('stage').innerText = ""
            document.getElementById('description').innerText = ""
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
        
        //used in events
        async render(){
            this.renderNetwork()
            await this.queryElement()
        }
    },

    mounted() {
        window.addEventListener('resize', this.debounce(this.render, 150))

        this.fixHeight()

    },

    watch: {
        title(newVal, oldVal) {
            console.log("title changed", `${newVal} : ${oldVal}`)
            this.clear()
            
        }
    }

}

</script>

<style scoped>
h2.dialogue-title {
    font-size: 4vh;
}

h3.dialogue-heading {
    font-size: 2vh;
}

h4 {
    margin-top: 2vh;
    margin-bottom: 1vh;;
}
.el-divider--vertical {
  height: 70vh;
  margin: 0px 20px;
}

.el-divider--horizontal {
    margin: 1vh 0vh;
}

.dialogue-title-wrapper {
    margin: 0vh 2vh;
}

.dialogue-legends .dialogue-heading {
    margin-left: 2vh;
}
.networkFull {
    background-color: white;
    height: 70vh;
    width: 40vw;
}

.dialogue-agreement-list {
    padding: 1vh 0vh;
}

.dialogue-agreement-list:first-of-type {
    padding-top: 0vh;
}

/* .if-entity-list {
    overflow-y: auto;
    height: 60vh;
} */

.small {
    margin-top: 1vh;
}

</style>