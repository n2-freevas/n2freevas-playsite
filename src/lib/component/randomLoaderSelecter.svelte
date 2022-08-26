<script lang="ts">
    import PendulumLoader from './Loader/pendulumLoader.svelte'
    import RectWaveLoader from './Loader/rectWaveLoader.svelte'

    let random_select = Math.floor(Math.random() * 4)
</script>

{#if random_select == 0}
    <PendulumLoader />
{:else if random_select == 1}
    <RectWaveLoader />
{:else if random_select == 2}
    <PendulumLoader />
{:else if random_select == 3}
    <PendulumLoader />
{:else}
    <PendulumLoader />
{/if}
<div>Loading...</div>

<style lang="scss">
</style>
