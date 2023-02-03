<template>
    <div class="dialogue-title-wrapper">
        <h2 class="dialogue-title">{{ title }}</h2>
        <p class="dialogue-description">
            Hover to see the connection.
        </p>
        <div style="display: flex; margin: 1vh 0px;">
            <h4>Legend</h4>
            <div style="margin-left: 20px; display: flex;">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 20 20" overflow="visible" stroke="black" stroke-width="5" ><line x2="23" y2="23" /><line x1="23" y2="23" /></svg>
            <p style="margin-left: 10px;"> party</p>
            </div>
            <div style="margin-left: 20px; display: flex;">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 20 20" overflow="visible" stroke="lightgrey" stroke-width="5" ><line x2="23" y2="23" /><line x1="23" y2="23" /></svg>
                <p style="margin-left: 10px;"> third party</p>
            </div>
        </div>
    </div> 

    <div class="adjacencymatrics">
        <div id="adjacencymatrics" style="position: relative; "></div>
    </div>
</template>


<script>
let view1

export default ({
    props: ["title", "agtNum", "actorNum"],

    data() {
        return {
            height: 10,
            width: 10,
            unitSideLength: 20
        }
    },

    methods: {
        getSize() {
            let matricsDiv = document.querySelector('.adjacencymatrics')
            let height = matricsDiv.offsetHeight - 70
            let width = matricsDiv.offsetWidth - 100

            let xSideLength = Math.ceil( width / this.actorNum)
            let ySideLength = Math.ceil( height / this.agtNum)

            let unit
            let unitMin = 25

            let tmp = Math.min( xSideLength, ySideLength )
            if ( tmp > unitMin ) {
                unit = tmp - 5
            }
            else {
                unit = unitMin
            }
            this.height = unit * this.agtNum
            this.width = unit * this.actorNum
            if ( this.height > height ) {
                matricsDiv.style.height = `${this.height + 100}px`
            }
            else {
                matricsDiv.style.height = "70vh"
            }
        },

        async renderMatrics() {
            var select = this.title
            var marticskWidth = this.width
            var marticsHeight = this.height


            view1 = await NetPanoramaTemplateViewer.render(`..${__webpack_public_path__}templates/matrix.json`, 
                    {
                        fileUrl: `"..${__webpack_public_path__}data/russia.json"`,
                        peaceProcess: `'${select}'`,
                        autoWidth: `${marticskWidth}`,
                        autoHeight: `${marticsHeight}`
                    }, "adjacencymatrics")
            console.log("RENDER MATRICS")
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

        async render() {
            await this.getSize()
            this.renderMatrics()
            await this.queryElement()
        }
    }
})
</script>

<style scoped>
.dialogue-title-wrapper {
    background-color: white;
}
.adjacencymatrics {
    background-color: white;
    height: 70vh;
}
</style>
