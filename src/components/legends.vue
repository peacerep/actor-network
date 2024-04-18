<template>
    <div class="legend-container">
        <div>
            <p class="network-legends">Agreement</p>
            <svg id="agt_legend"></svg>
        </div>
        
        <div>
            <p class="network-legends">Signatory Types</p>
            <svg id="edge_legend"></svg>
        </div>

        <div id="legend">
            <div class="legend-info">
                <p class="network-legends">Actor Groups</p>

                <el-popover placement="right" :width="650" trigger="hover">
                    <template #reference>
                        <el-icon style="margin: 0px 5px;"><CirclePlus /></el-icon>
                    </template>
                    <el-table :data="this.actors" height="500">
                        <el-table-column width="120" property="Actor Type Label" label="Actor" />
                        <el-table-column property="Definition" label="Description" />
                    </el-table>
                </el-popover>

            </div>
            <svg v-if="this.width >= 1200" id="entity_legend"></svg>
            <svg v-else-if="this.width < 1200 && this.width >= 300" id="test_legend"></svg>
        </div>
  </div>
</template>

<script>
    import * as d3 from "d3";
    import actors from "@/data/actor_definitions.json"

    export default {
    props: ["actorTypeLegendList", "colorRange", "agtColor", "sigColorRange"],

    data() {
        return {
            actors: [],
            timelienLegends:["other agreements"],
            width: 0,
            // agtColor: "#34495E"
        };
    },
    
    mounted() {
        this.actors = actors
        // this.load()

        setTimeout(() => {
                this.load()
            }, 200);


        window.addEventListener('resize', this.debounce(this.render, 100))
    },

    methods: {
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
        
        getWiddow() {
            var w = window.outerWidth;
            this.width = w
            return w
        },

        async render() {
            await this.clearSvg()
            await this.getWiddow()
            setTimeout(this.renderLegend(), 50)
            // await this.renderLegend()
        },

        async load() {
            await this.getWiddow()
            setTimeout(this.renderLegend(), 50)
        },

        clearSvg() {
            const agtSvg = document.getElementById('agt_legend')
            const edgeSvg = document.getElementById('edge_legend')
            
            if ( this.width >= 1200 ){
                const entitySvg = document.getElementById('entity_legend')
                while (entitySvg.childNodes.length > 0) {
                    entitySvg.removeChild(entitySvg.childNodes[0])
                }
            }
            else {
                const testSvg = document.getElementById('test_legend')
                while (testSvg.childNodes.length > 0) {
                    testSvg.removeChild(testSvg.childNodes[0])
                }
            }
        
            while (agtSvg.childNodes.length > 0) {
                agtSvg.removeChild(agtSvg.childNodes[0])
            }
            while (edgeSvg.childNodes.length > 0) {
                edgeSvg.removeChild(edgeSvg.childNodes[0])
            }

            console.log("Legend cleared")
        },

        renderLegend() {
            const rectWidth = 16
            const dotRadius = 8
            const legendGap = 6

            // legends and colors from data
            const entities = this.actorTypeLegendList
            const colorRange = this.colorRange
            const entityNum = this.actorTypeLegendList.length

            const width = 250
            const height = entityNum * (2 * dotRadius + legendGap)

            const agt = ["Peace Agreement"]
            const signatory = ["Party", "Third Party"]
            // const sigColor = ["#C1C1C1","#D3D3D3"]

            var sigColorScale = d3.scaleOrdinal()
                                .domain(signatory)
                                .range(this.sigColorRange)

            var svg = d3.selectAll("#entity_legend")
                        .attr('width', width)
                        .attr('height', height)

            var color = d3.scaleOrdinal()
                        .domain(entities)
                        .range(colorRange);
            
            //entities in media query
            svg.selectAll("dots")
                .data(entities)
                .enter()
                .append("circle")
                    .attr("cx", 30)
                    .attr("cy", function(d,i){ return 10 + i* (dotRadius*2 + legendGap)})
                    .attr("r", dotRadius)
                    .style("fill", d => color(d));
    
            svg.selectAll("labels")
                .data(entities)
                .enter()
                .append("text")
                .attr("x", 50)
                .attr("y", function(d,i){ return 12 + i* (dotRadius*2 + legendGap)})
                .style("fill", "black")
                .text(d => d)
                .attr("text-anchor", "left")
                .attr("class", "legend-labels")
                .style("alignment-baseline", "middle");

            //the second legend
            var svgH = d3.selectAll("#test_legend")
                        .attr('height', 120)
                        .attr('width', 350)
                        
            var g = svgH.append('g')
                        .attr('class', 'legend-groups')
                        .attr("transform", function(d, i) {
                            return "translate(0,0)";
                        })

            g.selectAll('g')
                .data(entities)
                .enter()
                .append('circle')
                .attr("cx", function(d, i){
                    if (i <= 4 ) { return 30 }
                    else { return 200 }
                })
                .attr("cy", function(d,i){ 
                    if (i <= 4) { return 10 + i*24}
                    else { return i*25 - 115}
                })
                .attr("r", dotRadius)
                .style("fill", d => color(d));
            
            g.selectAll('g')
                .data(entities)
                .enter()
                .append("text")
                .attr("x", function(d, i){
                    if (i <= 4 ) { return 50 }
                    else { return 220 }
                })
                .attr("y", function(d,i){ 
                    if (i <= 4) { return 10 + i*24}
                    else { return i*25 - 115}
                })
                .style("fill", "black")
                .text(d => d)
                .attr("text-anchor", "left")
                .attr("class", "legend-labels")
                .style("alignment-baseline", "middle")
            
                        
            //agt_legend
            var svgAgt = d3.selectAll("#agt_legend")
                        .attr('width', width)
                        .attr('height', 50);

            svgAgt.selectAll("rect")
                    .data(agt)
                    .enter()
                    .append("rect")
                        .attr("x", 22)
                        .attr("y", function(d,i){ return 0 + i*25})
                        .attr("width", rectWidth)
                        .attr("height", rectWidth)
                        .style("fill", this.agtColor)

            svgAgt.selectAll("labels")
                .data(agt)
                .enter()
                .append("text")
                .attr("x", 50)
                .attr("y", function(d,i){ return 10 + i*25})
                .style("fill", "black")
                .text(d => d)
                .attr("text-anchor", "left")
                .attr("class", "legend-labels")
                .style("alignment-baseline", "middle")

            var svgSig = d3.selectAll("#edge_legend")
                        .attr('width', width)
                        .attr('height', 60);

            svgSig.selectAll("rect")
                    .data(signatory)
                    .enter()
                    .append("rect")
                        .attr("x", 22)
                        .attr("y", function(d,i){ return 6 + i*25})
                        .attr("width", 30)
                        .attr("height", function(d,i){ return 8 / (i+1) })
                        .style("fill", d => sigColorScale(d))

            svgSig.selectAll("labels")
                .data(signatory)
                .enter()
                .append("text")
                .attr("x", 60)
                .attr("y", function(d,i){ return 10 + i*25})
                .style("fill", "black")
                .text(d => d)
                .attr("text-anchor", "left")
                .attr("class", "legend-labels")
                .style("alignment-baseline", "middle")
            }
        }
    }
</script>


<style scoped>
.legend-info {
    display: flex;
    flex-direction: row;
}

.tooltip-actor {
    background: rgba(69,77,93,.9);
    border-radius: .1rem;
    color: #fff;
    display: block;
    font-size: 14px;
    max-width: 320px;
    padding: .2rem .4rem;
    position: absolute;
    text-overflow: ellipsis;
    white-space: pre;
    z-index: 999;
}


</style>