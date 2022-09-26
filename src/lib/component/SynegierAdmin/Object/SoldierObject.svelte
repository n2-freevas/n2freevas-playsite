<script lang="ts">
    import type { SoldierCardInPlay } from '$lib/model/app/SynegierAdmin'
    export let model: SoldierCardInPlay
</script>

<div class="soldierObject" style="width:{model.size}px; height:{model.size}px" />

<style lang="scss">
    .soldierObject {
        border-radius: 25px;
        background: red;
    }
</style>
