<script lang="ts">
    import { mainmenus } from '$lib/store/MainMenu'
    import MediaQuery from 'svelte-media-query'
    import HeaderMenuBox from '../lib/component/HeaderMenuBox.svelte'
    import HambergerMenuBox from '$lib/component/HambergerMenuBox.svelte'
    import ToastArea from '$lib/component/toast/ToastArea.svelte'

    let sliderOpen = false
</script>

<svelte:head>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" />
    <link
        href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
        rel="stylesheet" />
</svelte:head>

<header>
    <div class="n2-logo">
        <a href="/">
            <img src="/img/n2-icon-white.svg" alt="" />
        </a>
    </div>
    <MediaQuery query="(min-width: 701px)" let:matches>
        {#if matches}
            <div class="menu-row-list">
                {#each $mainmenus as menu}
                    {#if menu.active}
                        <HeaderMenuBox
                            name={menu.name}
                            path={menu.path}
                            img={menu.img}
                            explain={menu.explain} />
                    {/if}
                {/each}
            </div>
        {/if}
    </MediaQuery>

    <MediaQuery query="(max-width: 700px)" let:matches>
        {#if matches}
            <div
                class="hamburger-menu"
                on:click={() => {
                    sliderOpen ? (sliderOpen = false) : (sliderOpen = true)
                }}>
                <span class="hamburger-button">
                    <span class="bar bar1" />
                    <span class="bar bar2" />
                    <span class="bar bar3" />
                </span>
                <div class="hamburger-slider {sliderOpen ? 'open' : ''}">
                    {#each $mainmenus as menu}
                        {#if menu.active}
                            <HambergerMenuBox
                                name={menu.name}
                                path={menu.path}
                                img={menu.img}
                                explain={menu.explain} />
                        {/if}
                    {/each}
                </div>
            </div>
        {/if}
    </MediaQuery>
</header>

<section id="main">
    <slot />
</section>
<ToastArea />

<style lang="scss">
    header {
        background: black;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 60px;
        z-index: 100;
        .n2-logo {
            padding: 10px;
            img {
                height: 30px;
            }
        }
        .menu-row-list {
            margin: 0 20px;
        }

        .hamburger-menu {
            position: relative;
            padding: 10px;
            .hamburger-button {
                .bar {
                    display: block;
                    background-color: #fff;
                    height: 4px;
                    width: 30px;
                    border-radius: 1px;
                }
                .bar1 {
                    transform: translateY(-6px);
                    transition: transform 0.3s;
                }
                // .bar2{

                // }
                .bar3 {
                    transform: translateY(6px);
                    transition: transform 0.3s;
                }
            }
            .hamburger-slider {
                position: fixed;
                z-index: 100;
                width: 300px;
                top: 100px;
                right: -320px;
                background: linear-gradient(90deg, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.8));
                transition: 0.3s;
                &.open {
                    right: 0;
                }
            }
        }
    }
    main {
        z-index: 0;
    }
</style>
