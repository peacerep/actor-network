<template>
    <div style="margin: 30px 0px;">
        <div>
            <p class="network-legends">Agreement</p>
            <svg id="agt_legend"></svg>
        </div>
        
        <div>
            <p class="network-legends">Signatory types</p>
            <svg id="edge_legend"></svg>
        </div>

        <div>
            <p class="network-legends">Entity groups</p>
            <svg id="entity_legend"></svg>
        </div>
  </div>
</template>

<script>
    import * as d3 from "d3";
    export default {
    data() {
        return {
            timelienLegends:["other agreements"]
        };
    },
    
    mounted() {
        const width = 280;

        const entities = [
            "Armed Group", 
            "IGO", 
            "Country/State", 
            "State Coalition", 
            "Region", 
            "Other",
            "Political Party",
            "Political Party/Armed Group",
            "UN Mission",
            "Entity"
        ];

        let timelineList = ["other agreemenets", "agreements signed in selected process"];
        let timelineColors = ["#D9D9D9", "#60A18B"];
        var timelineColorScale = d3.scaleOrdinal()
                                    .domain(timelineList)
                                    .range(timelineColors);
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
                        .attr("x", 50)
                        .attr("y", (d,i) => (i*25 + 15))
                        .style("fill", "black")
                        .text(d => d);

        const agt = ["Peace Agreement"];

        const signatory = ["Party", "Third Party"];
        const sigColor = ["#C1C1C1","#D3D3D3"];

        var sigColorScale = d3.scaleOrdinal()
                            .domain(signatory)
                            .range(sigColor);

        var svg = d3.select("#entity_legend")
                    .attr('width', width)
                    .attr('height', 250);

        var colorRange = [
                "#568AA4",
                "#335B60",
                "#EAC05B",
                "#CDD2CC",
                "#F3F2D7",
                "#B16748",
                "#7FAADC",
                "#9EB449",
                "#714FBA",
                "#E8A5D5"
        ];

        var color = d3.scaleOrdinal()
                    .domain(entities)
                    .range(colorRange);
        
        svg.selectAll("dots")
            .data(entities)
            .enter()
            .append("circle")
                .attr("cx", 30)
                .attr("cy", function(d,i){ return 10 + i*25})
                .attr("r", 10)
                .style("fill", d => color(d));
   
        svg.selectAll("labels")
            .data(entities)
            .enter()
            .append("text")
            .attr("x", 50)
            .attr("y", function(d,i){ return 10 + i*25})
            .style("fill", "black")
            .text(d => d)
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle");

        var svgAgt = d3.select("#agt_legend")
                    .attr('width', width)
                    .attr('height', 50);

        svgAgt.selectAll("rect")
                .data(agt)
                .enter()
                .append("rect")
                    .attr("x", 22)
                    .attr("y", function(d,i){ return 0 + i*25})
                    .attr("width", 18)
                    .attr("height", 18)
                    .style("fill", "#335B60")

        svgAgt.selectAll("labels")
            .data(agt)
            .enter()
            .append("text")
            .attr("x", 50)
            .attr("y", function(d,i){ return 10 + i*25})
            .style("fill", "black")
            .text(d => d)
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")

        var svgSig = d3.select("#edge_legend")
                    .attr('width', width)
                    .attr('height', 80);

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
            .style("alignment-baseline", "middle")
    }
    };
</script>


<style scoped>

</style>