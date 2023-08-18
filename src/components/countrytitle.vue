<template>
    <div class="title-wrapper">
      <h1>{{ countryTitle }} as a Global Peace Actor</h1>
      <h1 class="sub-heading">Actor Networks of {{ countryTitle }}'s involvement in Peace and Transition Processes</h1>
    </div>

    <div class="top-description-wrapper">
        <p class="top-description">
            Explore actor networks representing past peace and transition agreements where {{ countryTitle }} has been involved globally, since 1990. All networks illustrate any agreement where {{ countryTitle }} has been a party or third party signatory, and all other signatories of that agreement. 
            <br />
            Source: <el-link class="source-link" href="https://www.peaceagreements.org/search">Peace Agreement Database</el-link>
        </p>
    </div>

</template>

<script>
    export default {
        data() {
            return {
                countryTitle: 'UK'
            }
        }
    }

    
</script>
