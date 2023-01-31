<template>
    <div class="component-container">
        <p class="top-sub">Timeline</p>
        <h3>Agreements signed through 1990 - 2021</h3>
        
        <svg id="timeline_legend"></svg>
        
        <div class="timeline">
            <div id="timeline" style="width: 100%; height:300px; position: relative; z-index:0;" ></div>
        </div>
    </div>

</template>


<script>
export default ({
    data() {
        return {
            legendList: ['other agreements']  
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