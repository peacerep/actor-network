<template>
    <div class='selector-wrapper'>
        <el-button v-if="showButton" @click="goToLink" type="warning">
            View Story
        </el-button>
    </div>
</template>

<script>
export default {
    props:["country"],
    computed: {
    showButton() {
      return this.country === 'China' || this.country === 'Russia';
    }
  },
  methods: {
    goToLink() {
      let link = '';
      if (this.country === 'China') {
        link = 'https://tvancisin.github.io/peace_scroll/?subset=chinas#';
      } else if (this.country === 'Russia') {
        link = 'https://tvancisin.github.io/peace_scroll/?subset=russia#';
      }
      window.open(link, '_blank');
    }
  }
}
</script>
