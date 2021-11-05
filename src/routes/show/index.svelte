<script lang="ts">
    import PendulumLoader from '$lib/component/Loader/pendulumLoader.svelte';
    import RectWaveLoader from '$lib/component/Loader/rectWaveLoader.svelte';
    import RoundFloweringLoader from '$lib/component/Loader/roundFloweringLoader.svelte';
    import Bs2ndLoader from '$lib/component/Loader/bs2ndLoader.svelte';
    import ShowItem from './_show_item.svelte'
    import MediaQuery from 'svelte-media-query'
    import DotStringLoader from '$lib/component/Loader/DotStringLoader.svelte';

    type ShowItemArg = {
        name: string,
        component: Function
    }
    const show_item_args : ShowItemArg[]= [
        {name: "bs2nd", component: Bs2ndLoader},
        {name: "Pendulum", component: PendulumLoader},
        {name: "Rect Wave", component: RectWaveLoader},
        {name: "Round Flowering", component: RoundFloweringLoader},
        {name: "Dot Strings", component: DotStringLoader}
    ]
</script>

<section class='show-room'>
    {#each show_item_args as arg}
    <MediaQuery query="(max-width: 700px)" let:matches>
        {#if matches}
        <div class='show-box-phone'>
            <ShowItem name={arg.name} component = {arg.component} />
        </div>
        {/if}
    </MediaQuery>
    <MediaQuery query="(min-width: 701px)" let:matches>
        {#if matches}
        <div class='show-box'>
            <ShowItem name={arg.name} component = {arg.component} />
        </div>
        {/if}
    </MediaQuery>
    {/each}
    
</section>


<style lang="scss">
    .show-room{
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-around;
        .show-box{
            flex-basis: 40%;
        }
        .show-box-phone{
            flex-basis: 90%;
        }
    }
    

</style>
