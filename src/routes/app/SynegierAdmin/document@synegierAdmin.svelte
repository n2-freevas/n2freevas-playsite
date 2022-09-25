<script lang="ts">
    import { getCardDatus, getSoldierDatus, getBattleFieldDatus } from '$lib/api/app/synegierAdmin'
    import Card from '$lib/component/SynegierAdmin/Card/Card.svelte'
    import Soldier from '$lib/component/SynegierAdmin/Card/Soldier.svelte'
    import BattleFieldComponent from '$lib/component/SynegierAdmin/UI/BattleField.svelte'
    import Button from '$lib/component/SynegierAdmin/UI/Button.svelte'
    import type { BattleField, SoldierCard, SynegierCard } from '$lib/model/app/SynegierAdmin'
    import { synegierAdminAccessToken } from '$lib/store/app/synegierAdmin'
    import { onMount } from 'svelte'

    let datus: SynegierCard[] = []
    let soldiers: SoldierCard[] = []
    let flip: boolean = false
    let cardSizeMargin: number = 0
    let battleFields: BattleField[] = []

    onMount(async () => {
        datus = await (await getCardDatus($synegierAdminAccessToken)).slice(0, 20)
        cardSizeMargin = 1 / datus.length
        soldiers = await (await getSoldierDatus($synegierAdminAccessToken)).slice(0, 1)
        battleFields = await (await getBattleFieldDatus($synegierAdminAccessToken)).slice(0, 2)
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
        <Card model={d} scale={cardSizeMargin * (i + 1)} bind:isFlip={flip} />
    {/each}
</div>

{#each battleFields as bf}
    <div style="position:relative; width: 1000px; height:800px;">
        <BattleFieldComponent model={bf} />
    </div>
{/each}

<style lang="scss">
    .list {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
    }
</style>
