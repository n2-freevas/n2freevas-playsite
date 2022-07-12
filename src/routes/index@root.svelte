<script lang="ts">
    import HomeButton from '$lib/component/HomeButton.svelte'
    import {mainmenus} from '$lib/store/MainMenu'
    import MediaQuery from 'svelte-media-query'
    import N2Clock from '$lib/component/N2Clock.svelte'
    
    let mainmenu_array = $mainmenus
</script>

<div id='menu_box'>
    
    <MediaQuery query="(min-width: 701px)" let:matches>
        {#if matches}
        <div class="icon_box">
            {#each mainmenu_array as menu}
                <HomeButton model={menu} size={100}></HomeButton>
            {/each}
        </div>
        {/if}
    </MediaQuery>
    <MediaQuery query="(max-width: 700px)" let:matches>
        {#if matches}
        <div class="icon_box">
            {#each mainmenu_array as menu}
                <HomeButton model={menu} size={85}></HomeButton>
            {/each}
        </div>
        {/if}
    </MediaQuery>
    <N2Clock></N2Clock>
</div>

<style lang="scss">
    #menu_box{
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 70vh;
        max-height: 700px;
        max-width:500px;
        margin:0 auto;
        overflow: hidden;
    }
    .icon_box{
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-around;
        border: solid 1px white;
        max-width: 350px;
        padding:20px 10px;
        margin:0 40px;
        
    }


</style>
