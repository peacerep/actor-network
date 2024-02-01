<template>
    <div class="component-container">
        <div class="title">
            <h3 class="top-sub">Timeline</h3>
            <h3>All Agreements Signed 1990 - 2021</h3>
            <p class="chart-description">
                Hover to see agreement name.
            </p>
        </div>
        <svg id="timeline_legend"></svg>
        <div class="timeline">
            <div id="timeline" style="width: 100%; " ></div>
        </div>
        <div class="title">

        <el-button size="small" round @click="exportTimeline()" class="export-button">
            Download as PNG<el-icon><Download /></el-icon>
        </el-button>
        </div>
    </div>

</template>


<script>
import * as svg from 'save-svg-as-png';
import * as d3 from "d3";

export default ({
    props: ["data", "agtColor"],

    data() {
        return {
            legendList: ['other agreements'],
            processName: ''  
        }
      
    },

    methods: {
        exportTimeline() {
            svg.saveSvgAsPng(document.querySelector('.timeline svg'), "timeline.png");
        },

        renderTimelineLegend() {
            // var agtColor = JSON.stringify(this.agtColor)

            let timelineList = [`Agreement in ${this.processName}`, "All other agreements"];
            let timelineColors = [this.agtColor, "#D9D9D9"];
            var timelineColorScale = d3.scaleOrdinal()
                                        .domain(timelineList)
                                        .range(timelineColors)

            var timelineSvg = d3.select("#timeline_legend")
                                    .attr("width", 800)
                                    .attr("height", 50)

            timelineSvg.selectAll("rect")
                        .data(timelineList)
                        .enter()
                        .append('rect')
                            .attr("x", 20)
                            .attr("y", (d,i) => (i*25))
                            .attr("width", 18)
                            .attr("height", 18)
                            .style("fill", d => timelineColorScale(d));

            timelineSvg.selectAll("labels")
                        .data(timelineList)
                        .enter()
                        .append('text')
                            .attr("class", "legend-labels")
                            .attr("x", 50)
                            .attr("y", (d,i) => (i*25 + 15))
                            .style("fill", "black")
                            .text(d => d);
        }
    },

    mounted() {
        this.renderTimelineLegend()
    },

    computed:{
		get(){
			return this.data;
		}
	},

	watch:{
		get(val){
            this.processName = val.pp
		},

        processName(newValue, oldValue) {
            const svgElement = document.getElementById('timeline_legend')
            while (svgElement.childNodes.length > 0) {
                svgElement.removeChild(svgElement.childNodes[0])
            }
            this.renderTimelineLegend()
       
        }
	}
})
</script>


<style scoped>
.timeline {
    height: 300px;
    background-color: white;
}
</style>