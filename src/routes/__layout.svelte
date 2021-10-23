<script lang="ts">
    import {mainmenus} from '$lib/store/MainMenu'
    import MediaQuery from 'svelte-media-query'
    import HeaderMenuBox from '../lib/component/HeaderMenuBox.svelte'
    import HambergerMenuBox from '$lib/component/HambergerMenuBox.svelte';
</script>

<header>
    <div class='n2-logo'>
        <a href='/'>
            <img src='/img/n2-icon-white.svg' alt=''>
        </a>
    </div>
    <MediaQuery query="(min-width: 701px)" let:matches>
        {#if matches}
            <div class='menu-row-list'>
            {#each $mainmenus as menu}
                <HeaderMenuBox name={menu.name} path={menu.path} img={menu.img} explain={menu.explain}></HeaderMenuBox>
            {/each}
            </div>
        {/if}
    </MediaQuery>
    
    <MediaQuery query="(max-width: 700px)" let:matches>
        {#if matches}
        <div class='hamburger-menu'>
            <span class='hamburger-button'>
                <span class='bar bar1'></span>
                <span class='bar bar2'></span>
                <span class='bar bar3'></span>
            </span>
            <div class='hamburger-slider'>
                {#each $mainmenus as menu}
                    <HambergerMenuBox name={menu.name} path={menu.path} img={menu.img} explain={menu.explain}></HambergerMenuBox>
                {/each}
            </div>
        </div>
        {/if}
        
    </MediaQuery>
    
</header>

<slot></slot>

<style lang="scss">
    header{
        background: black;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height:60px;
        .n2-logo{
            img{
                margin:10px;
                height:40px;
            }
        }
        .menu-row-list{
            margin:0 20px;
        }
        
        .hamburger-menu{
            position: relative;
            padding:10px;
            .hamburger-button{
                .bar{
                    display: block;
                    background-color: #fff;
                    height: 4px;
                    width: 30px;
                    border-radius: 1px;
                }
                .bar1{
                    transform: translateY(-6px);
                    transition: transform .3s;
                }
                .bar2{
                    
                }
                .bar3{
                    transform: translateY(6px);
                    transition: transform .3s;
                }
            }
            .hamburger-slider{
                position: absolute;
                display: none;
                width:250px;
                height:100vh;
                top:0;bottom:0;
                right:0;
                background: blue;
                z-index:100;
            }
        }
        
        
    }

</style>