<template>
    <div class="dialogue-title-wrapper">
        <h2 class="dialogue-title">{{ title }}</h2>
        <p class="dialogue-description">
            Agreements and relevant actors, ordered in a list view by agreement date and actor type.
        </p>
    </div>

    <div class="dialogue-container">
        <div class="dialogue-legends" id="list-legend">
            <h3 class="dialogue-heading">Legends</h3>
            <legends :actorTypeLegendList="actorTypeLegendList" :colorRange="colorRange"/>
        </div>

        <el-divider v-if="this.w >= 1200" direction="vertical" content-position="center" />
        <el-divider v-else-if="this.w < 1200 && this.w >= 300" content-position="center" />

        <div class="listFull">
            <div id="listFull" style="position: relative; "></div>
        </div>

    </div>
</template>

<script>
import legends from '../components/legends.vue'

export default {
    components: { legends },
    props: ["country", "title", "agtNum", "maxNum", "actorTypeLegendList", "colorRange"],

    data() {
        return {
            width: 600,
            height: 800,
            w: 0
        }
    },

    methods: {
        getWiddow() {
            var w = window.innerWidth;
            this.w = w
            return w
        },

        //define chart size
        getSize(){
            let listDiv = document.querySelector('.listFull')
            let height = listDiv.offsetHeight
            let width = listDiv.offsetWidth
            this.width = width - 300
            console.log({height: height, width: width})

            const unitHeight = 18
            var row = Math.ceil(this.maxNum / 16)
            var listNewHeight = unitHeight * ( this.agtNum * row)
            this.height = listNewHeight + 50
        },

        //render chart
        async renderList() {
            this.getWiddow()
            this.getSize()
            var select = this.title
            var listWidth = this.width
            var listHeight = this.height

            // legends for list
            var actorTypeLegendList = JSON.stringify(this.actorTypeLegendList)
            var colorRange = JSON.stringify(this.colorRange)

            var view1 = await NetPanoramaTemplateViewer.render(`..${__webpack_public_path__}templates/list.json`, 
                    {
                        fileUrl: `"..${__webpack_public_path__}data/uk.json"`,
                        peaceProcess: `'${select}'`,
                        autoWidth: `${listWidth}`,
                        autoHeight: `${listHeight}`,
                        actorTypeLegendList: `${actorTypeLegendList}`,
                        colorRange: `${colorRange}`,
                        country:`'${country}'`
                    }, 
                    "listFull")
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
                            console.log("SUB ELEMENT REMOVE", element)
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
        
        async render() {
            // this.renderLegend()
            this.renderList()
            await this.queryElement()
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
    },

    mounted() {
        let divList = document.querySelectorAll('#list-legend .legend-container div')
        for (const [index, div] of divList.entries()) {
            if (index <= 1) {
                div.remove()
            }
        }

        // window.addEventListener('load', this.renderList)
        window.addEventListener('resize', this.debounce(this.getWiddow, 100))
    }


}
</script>


<style>

h2.dialogue-title {
    font-size: 4vh;
}

h3.dialogue-heading {
    font-size: 2vh;
}

.el-divider--vertical {
  height: 60vh;
  margin: 0px 20px;
}

.el-divider--horizontal {
    margin: 1vh 0vh;
}

.listFull {
    background-color: white;
    height: 70vh;
    width: 100%;
}

.dialogue-legends .dialogue-heading {
    margin-left: 2vh;
}

.dialogue-container {
    display: flex;
    flex-direction: row;
    flex-direction: row;
    margin: 1vh 0vw;
    padding-top: 2vh;
}

.dialogue-legends {
    width: 20%;
}

.dialogue-description { width: 30%; }


</style>