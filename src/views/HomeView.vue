<template>
  <div class="top-layout">
    <el-container>
      <el-aside class="top-side" width="35%">
        <countrytitle />
      </el-aside>

      <el-main class="top-main">
        <countrymetrics />
        <timeline />
      </el-main>
    </el-container>
  </div>

  <div class="process-layout">
    <peaceprocess />
  </div>

</template>

<script>
  import peaceprocess from '../components/peaceprocess.vue'
  import countrytitle from '../components/countrytitle.vue'
  import timeline from '../components/timeline.vue'
  import countrymetrics from '../components/countrymetrics.vue'

  export default {
    components: {peaceprocess, countrytitle, timeline, countrymetrics},
  }

</script>