<template>
    <div class="component-container">
        <div class="title">
            <h3 class="top-sub">Overview</h3>
            <h3>Country Involvement</h3>
        </div>

    <!-- ELEMENT ROW -->
    <div class="title">
        <div class="country-metrics-container">
                <div class="country-metrics-wrapper">
                    <p class="metrics-num"> {{ this.processNum }} </p>
                    <p class="metrics-title">Peace Processes</p>
                </div>
                <div class="country-metrics-wrapper">
                    <p class="metrics-num"> {{ this.agtNum }} </p>
                    <p class="metrics-title">Agreements</p>
                </div>
                <div class="country-metrics-wrapper">
                    <p class="metrics-num"> {{ this.actorNum -1 }} </p>
                    <p class="metrics-title">Other Actors</p>
                </div>
                <div class="country-metrics-wrapper">
                    <p class="metrics-num" id="timespan"> {{ this.timespan }} </p>
                    <p class="metrics-title">Activity Range</p>
                </div>
            </div>
    </div>

    </div>
</template>

<script>
    export default {
        props: ["processNum", "agtNum", "actorNum", "timespan" ]
    }
</script>


<style scoped>
</style>