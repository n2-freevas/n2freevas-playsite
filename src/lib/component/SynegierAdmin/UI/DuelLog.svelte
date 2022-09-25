<script lang="ts">
    import * as Model from '$lib/model/app/SynegierLogModel'
    import { battleLogStore } from '$lib/store/app/synegierBattleLog'
</script>

<div id="BattleLog">
    {#each $battleLogStore as log}
        test
    {/each}
</div>

<style lang="scss">
</style>
