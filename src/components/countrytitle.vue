<template>
    <div class="title-wrapper">
      <h1>{{ countryTitle }}</h1>
      <h1 class="sub-heading">Peace Agreements Actor Mapping</h1>
    </div>

    <div class="top-description-wrapper">
        <p class="top-description">
            Explore actor networks showing who signed peace agreements by country and peace process, and type of actor. 
            <br />
            Source: <el-link class="source-link" href="https://www.peaceagreements.org/search">https://www.peaceagreements.org/search</el-link>
        </p>
    </div>

</template>

<script>
    export default {
        data() {
            return {
                countryTitle: 'Russia'
            }
        }
    }

    
</script>
