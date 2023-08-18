<template>
    <div class="dialogue-title-wrapper">
        <h2 class="dialogue-title">{{ title }}</h2>
        <p class="dialogue-description">
            Agreements ordered by date listed on left column, actors on the right.
        </p>
    </div>

    <div class="dialogue-container">
        <div class="dialogue-legends">
            <h3 class="dialogue-heading">Legends</h3>
            <legends />
        </div>
        <el-divider v-if="this.w >= 1200" direction="vertical" content-position="center" />
        <el-divider v-else-if="this.w < 1200 && this.w >= 300" content-position="center" />

        <div class="jigsawFull">
            <div id="jigsawFull" style="position: relative; "></div>
        </div>

    </div>
</template>

<script>
import legends from '../components/legends.vue'

export default {
    components: { legends },
    props: ["title"],

    data() {
        return {
            width: 0,
            height: 0,
            w: 0
        }
    },

    mounted() {
        window.addEventListener('resize', this.debounce(this.getWiddow, 100))
    },

    methods: {
        getWiddow() {
            var w = window.innerWidth;
            this.w = w
            return w
        },

        //define chart size
        getSize(){
            let jigsawDiv = document.querySelector('.jigsawFull')
            let height = jigsawDiv.offsetHeight
            let width = jigsawDiv.offsetWidth

            this.height = height - 50
            this.width = width
        },

        //render chart
        async renderJigsaw() {
            this.getWiddow()
            this.getSize()
            var select = this.title
            var jigsawWidth = this.width - 340
            var jigsawHeight = this.height

            console.log('Jigsaw FULL', {jigsawWidth: jigsawWidth, jigsawHeight: jigsawHeight})

            var view1 = await NetPanoramaTemplateViewer.render(`..${__webpack_public_path__}templates/jigsaw.json`, 
                    {
                        fileUrl: `"..${__webpack_public_path__}data/uk.json"`,
                        peaceProcess: `'${select}'`,
                        autoWidth: `${jigsawWidth}`,
                        autoHeight: `${jigsawHeight}`
                    }, 
                    "jigsawFull");
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
        
        async render() {
            this.renderJigsaw()
            await this.queryElement()
        }
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
  height: 90vh;
  margin: 0px 20px;
}

.el-divider--horizontal {
    margin: 1vh 0vh;
}

.jigsawFull {
    background-color: white;
    height: 90vh;
    width: 100%;
}

.dialogue-legends .dialogue-heading {
    margin-left: 2vh;
}


</style>