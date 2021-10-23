<script lang="ts">
    import HomeButton from '$lib/component/HomeButton.svelte'
    import {mainmenus} from '$lib/store/MainMenu'
    import MediaQuery from 'svelte-media-query'

    let mainmenu_array = $mainmenus
</script>

<div id='menu_box'>
    
    <MediaQuery query="(min-width: 701px)" let:matches>
        {#if matches}
        <div class="icon_box">
            {#each mainmenu_array as menu}
                <HomeButton path={menu.path} icon_url={menu.img} explain={menu.name}></HomeButton>
            {/each}
        </div>
        {/if}
    </MediaQuery>
    <MediaQuery query="(max-width: 700px)" let:matches>
        {#if matches}
        <div class="icon_box">
            {#each mainmenu_array as menu}
                <HomeButton path={menu.path} icon_url={menu.img} explain={menu.name}></HomeButton>
            {/each}
        </div>
        {/if}
    </MediaQuery>

</div>

<slot></slot>

<style lang="scss">
    #menu_box{
        max-height:700px;
        max-width:500px;
        margin:0 auto;
    }
    .icon_box{
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-around;
        border: solid 1px white;
        max-width: 400px;
        padding:20px 10px;
        margin: 100px 30px;
    }


</style>