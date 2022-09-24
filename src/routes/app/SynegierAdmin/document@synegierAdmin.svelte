<script lang="ts">
    import { getCardDatus, getSoldierDatus } from '$lib/api/app/synegierAdmin'
    import Card from '$lib/component/SynegierAdmin/Card.svelte'
    import Soldier from '$lib/component/SynegierAdmin/Soldier.svelte'
    import Button from '$lib/component/SynegierAdmin/UI/Button.svelte'
    import type { SoldierCard, SynegierCard } from '$lib/model/app/SynegierAdmin'
    import { synegierAdminAccessToken } from '$lib/store/app/synegierAdmin'
    import { onMount } from 'svelte'

    let datus: SynegierCard[] = []
    let soldiers: SoldierCard[] = []
    let flip: boolean = false

    onMount(async () => {
        datus = await (await getCardDatus($synegierAdminAccessToken)).slice(0, 5)
        soldiers = await (await getSoldierDatus($synegierAdminAccessToken)).slice(0, 1)
    })
</script>

{#each soldiers as s}
    <Soldier model={s} scale="small" />
    <Soldier model={s} scale="middle" />
    <Soldier model={s} scale="full" />
{/each}

<Button text="click" img="/img/n2-icon-white.svg" />

<Button
    text="flip"
    on:click={() => {
        flip = !flip
    }} />

<div class="list">
    {#each datus as d, i}
        <Card model={d} scale={0.20 * (i + 1)} bind:isFlip={flip} />
    {/each}
</div>

<style lang="scss">
    .list {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
    }
</style>
