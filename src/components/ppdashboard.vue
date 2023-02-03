<template>
    <hr />
    <div class='process-wrapper'>
        <h2>{{ this.title }}</h2>
    </div>

    <div class="parent">
        <div class="div1">
            <h3 class="top-sub">Key Metrics</h3>
            <h3>Summary</h3>
            <div class="metrics-wrapper">
                <p class="metrics-num"> {{ this.agtNum }} </p>
                <p class="metrics-title">agreements</p>
            </div>
            <div class="metrics-wrapper">
                <p class="metrics-num"> {{ this.actorNum }} </p>
                <p class="metrics-title">actors</p>
            </div>

            <div class="metrics-wrapper">
                <p class="metrics-num"> {{ this.time }} </p>
                <p class="metrics-title">timespan</p>
            </div>
            
        </div>

        <div class="div2">
            <h3 class="top-sub">Legends</h3>
            <h3>Entity and relations</h3>
            <legends />
        </div>
        <div class="div3">
            <div class="network">
            <div class="title">
                <h3 class="top-sub">Networks</h3>
                <h3>Actors agreement network view</h3>
                <p class="chart-description">
                    Forced layout of actor network.
                    <br />
                    <b>Hover</b> to see name of the dot.
                    <br />
                    <b>Click</b> to see agreement and actor connections.
                </p>
            </div>
            <div id="network" style="width: 100%; position: absolute; "></div>
        </div>
        </div>
        <div class="div4">
            <div class="list">
            <div class="title">
                <h3 class="top-sub">List</h3>
                <h3>Actors list view in each agreement</h3>
                <p class="chart-description">
                    List of actors associated to agreements, no particular relationship related.
                </p>
                <div id="list" style="width: 100%; position: absolute;"></div>
            </div>
        </div>
        </div>
        <div class="div5" id="div5">
            <div class="jigsaw">
            <div class="title">
                <h3 class="top-sub">Jigsaw</h3>
                <h3>Agreements and Actors in columns</h3>
                <p class="chart-description">
                    Agreements ordered by date listed on left column, actors on the right.
                </p>
            </div>
            <div id="jigsaw" style="width: 100%; position: absolute;" ></div>
        </div>
        </div>
    </div>



</template>

<script>
import legends from '@/components/legends.vue'

export default {
    components: {legends},

    props: ["data"],

    data() {
        return {
            title: '',
            agtNum: 0,
            actorNum: 0,
            time: ''
        }
    },

    computed:{
		get(){
			return this.data;
		}
	},
	watch:{
		get(val){
			console.log(val)
            this.title = val.pp
            this.agtNum = val.agtNum
            this.actorNum = val.actorNum
            this.time = val.time

		}
	}
}

</script>