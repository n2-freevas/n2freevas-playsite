<script lang="ts">
    import {getUnits, getUnitsUsingFilter, DEFAULT_LIMIT} from '$lib/api/app/bs2ndApi'
    import { onMount } from 'svelte';
    import type {kotodaman} from '$lib/model/app/Bs2ndModel'
    import Kotodaman from '$lib/component/bs2nd/kotodaman.svelte';

    let unitsfil: Array<kotodaman> = []
    onMount(async() =>{
        // const units = await getUnits(10,10)
        // console.log(units)

        unitsfil = await getUnitsUsingFilter(
                            0,DEFAULT_LIMIT,
                            ["さ","く","ん"],["木"],["魔"],["コピーガード"]
                        )
        console.log(unitsfil)
    })


</script>

<h1>BS2nd</h1>
{#each unitsfil as unit}
    <Kotodaman kotodaman={unit} />
{/each}

<style lang="scss">



</style>
