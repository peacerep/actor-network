<template>
    <div class="title-wrapper">
      <h1>{{ countryTitle }}</h1>
      <h1 class="sub-heading">Peace Agreements Actor Mapping</h1>
    </div>

    <div class="top-description-wrapper">
        <p class="top-description">
            We demonstrate the multiple peace processes this selected country is involved in, and agreements signed through the years.
        </p>
        <p class="top-description">
            Actors in peace processes varies from countries, international organisations, military groups and etc. Below are the actors and their relationships with agreements signed.
        </p>
        <p class="source">
            This dashboard collects peace processes data from PA-X dataset. <br/>
            Source: https://www.peaceagreements.org/search
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
