<script lang="ts">
    import ToastArea from '$lib/component/toast/ToastArea.svelte'
    import { modeStore } from '$lib/store/app/TCGsimStore'
    import { deckShuffle } from '$lib/component/TCG-sim/deckAndHand.svelte'
    import { boardListStore, handListStore, deckListStore, unshuffleDeckListStore, unshuffleExDeckListStore, exDeckListStore } from '$lib/store/app/TCGsimStore'
    import type { deckCardModel } from '$lib/model/app/TCGsimModel'

    async function reset() {
        $boardListStore = []
        $handListStore = []
        let deck: deckCardModel[] = Object.assign([], $unshuffleDeckListStore)
        $exDeckListStore = Object.assign([], $unshuffleExDeckListStore)
        deck.forEach((item) => {
            item.x = 0
            item.y = 0
            item.flip = true
        })
        $deckListStore = await deckShuffle(deck)
    }
</script>

<header>
    <div class="n2-logo">
        <a href="/">
            <img src="/img/n2-icon-white.svg" alt="" />
        </a>
    </div>
    <div class="color-config">
        <button
            class="pokemon"
            on:click={() => {
                $modeStore = 'pokemon'
                reset()
            }} />
        <button
            class="other"
            on:click={() => {
                $modeStore = 'other'
                reset()
            }} />
    </div>
</header>
<div id="tcg-all-compnents">
    <article id="screen">
        <section id="base" class={$modeStore}>
            <slot />
        </section>
    </article>

    <footer class={$modeStore}>
        <a href="/app/tcg-simulator/game">
            <div />
        </a>
        <a href="/app/tcg-simulator/edit">
            <div />
        </a>
    </footer>
</div>

<ToastArea />

<style lang="scss">
    :root {
        --header-height: 40px;
        --cw: 90px;
        --ch: 110px;

        // color
        --color_pokemon: #ffd900;
    }
    #tcg-all-compnents {
        display: flex;
        justify-content: space-between;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        overflow-y: scroll;
        -ms-overflow-style: none; /* IE, Edge 対応 */
        scrollbar-width: none; /* Firefox 対応 */
        &::-webkit-scrollbar {
            /* Chrome, Safari 対応 */
            display: none;
        }
    }
    header {
        display: flex;
        justify-content: space-between;
        height: var(--header-height);

        .n2-logo {
            padding: 10px;
            img {
                height: 20px;
            }
        }
        .color-config {
            margin: 0 20px 0 0;
            display: flex;
            align-items: center;
            button {
                width: 25px;
                height: 25px;
                margin: 0 7px;
                border-radius: 7px;
            }
            .pokemon {
                background: var(--color_pokemon);
            }
            .other {
                background: darkblue;
            }
        }
    }
    #screen {
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: calc(100vw - 70px);
        height: calc(100vh - 40px);
        #base {
            width: 1400px;
            height: 760px;
            margin: 0 auto;
            -moz-perspective: 500;
            -webkit-perspective: 500;
            -o-perspective: 500;
            -ms-perspective: 500;
            perspective: 500;
            background: rgb(36, 24, 110);
            background: radial-gradient(circle at bottom, rgba(36, 24, 110, 1) 0%, rgba(0, 0, 0, 1) 100%);
        }
    }

    footer {
        top: 0;
        bottom: 0;
        right: 0;
        width: 70px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        background: black;

        a {
            div {
                width: 50px;
                height: 50px;
                background: yellow;
            }
        }
    }
</style>
