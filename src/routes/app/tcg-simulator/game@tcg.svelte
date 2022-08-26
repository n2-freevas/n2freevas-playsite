<script lang="ts">
    import { onMount } from 'svelte'
    // import Viewport from 'svelte-viewport-info'
    import Card from '$lib/component/TCG-sim/card.svelte'
    import DeckAndHand from '$lib/component/TCG-sim/deckAndHand.svelte'
    import type { deckCardModel } from '$lib/model/app/TCGsimModel'
    import {
        modeStore,
        boardAreaInfoStore,
        handAreaInfoStore,
        deckAreaInfoStore,
        deckListStore,
        handListStore,
        boardListStore
    } from '$lib/store/app/TCGsimStore'
    import { cardInAnywhere, cardOutAnywhere } from '$lib/component/TCG-sim/util.svelte'
    import StorageComponent from '$lib/component/PokecaEffector/StorageComponent.svelte'
    import CoinComponent from '$lib/component/PokecaEffector/CoinComponent.svelte'
    import PokemonUtil from '$lib/component/TCG-sim/pokemonUtil.svelte'

    let isPC = true
    let window_width = 0
    let window_height = 0
    let window_width_require = 1500
    let window_height_require = 800

    function _getBoardInfo() {
        const boardInfo = document.getElementById('board').getBoundingClientRect()
        $boardAreaInfoStore = {
            top: boardInfo.top,
            left: boardInfo.left,
            right: boardInfo.right,
            bottom: boardInfo.bottom
        }
    }

    function _getHandInfo() {
        const handInfo = document.getElementById('handArea').getBoundingClientRect()
        $handAreaInfoStore = {
            top: handInfo.top,
            left: handInfo.left,
            right: handInfo.right,
            bottom: handInfo.bottom
        }
    }

    function _getDeckInfo() {
        const deckInfo = document.getElementById('deckArea').getBoundingClientRect()
        $deckAreaInfoStore = {
            top: deckInfo.top,
            left: deckInfo.left,
            right: deckInfo.right,
            bottom: deckInfo.bottom
        }
    }

    function _windowChangeHandler() {
        // 現在のブラウザの画面サイズを取得し、変数として確保
        window_width = window.innerWidth
        window_height = window.innerHeight
        if (window_width < window_width_require || window_height_require > window_height) {
            isPC = false
        }

        //主要elementの座標位置とサイズなどを再取得。
        _getBoardInfo()
        _getHandInfo()
        _getDeckInfo()
    }

    function cardHandInFromBoard(event) {
        const id = event.detail.id
        let target = $boardListStore.filter((card) => card.id == id).pop()
        $boardListStore = $boardListStore.filter((card) => card.id != id)
        target.x = 500
        target.y = 0
        $handListStore = [...$handListStore, target]
    }
    // DecK In Functions
    function cardDeckInFromBoard(event) {
        const id = event.detail.id
        const target: deckCardModel = {
            ...$boardListStore.filter((card) => card.id == id).pop(),
            x: 0,
            y: 0,
            rotate: 0,
            flip: true
        }
        $boardListStore = $boardListStore.filter((card) => card.id != id)
        if (event.detail.post == 'top') {
            $deckListStore = [...$deckListStore, target]
        } else if (event.detail.post == 'bottom') {
            $deckListStore = [target, ...$deckListStore]
        }
    }

    onMount(() => {
        _windowChangeHandler()
    })
</script>

<svelte:window bind:innerWidth={window_width} bind:innerHeight={window_height} />
{#if isPC}
    <article id="myDeckAndHand">
        <DeckAndHand />
    </article>

    <article id="board" class={$modeStore}>
        {#each $boardListStore as bs}
            <Card
                id={bs.id}
                pos_x={bs.x}
                pos_y={bs.y}
                flippin={bs.flip}
                pos_z={bs.z}
                onArea={'board'}
                img_url={bs.url}
                sleeve_url={bs.burl}
                rotate={bs.rotate}
                on:handIn={cardHandInFromBoard}
                on:deckIn={cardDeckInFromBoard} />
        {/each}
    </article>

    {#if $modeStore == 'pokemon'}
        <section id="pokemon-effect-layor">
            <StorageComponent />
        </section>

        <section id="pokemon-coin-layor">
            <CoinComponent />
        </section>

        <section id="pokemon-util-buttons">
            <PokemonUtil />
        </section>
    {/if}
{:else}
    <section id="is-not-PC-alert">
        <div class="panel">
            <h1>SORRY!</h1>
            <p>もっと大きい画面でご利用ください。</p>
            {#if window_width >= window_width_require && window_height_require <= window_height}
                <p class="clear">条件をクリアしました！リロードしてください。</p>
            {/if}
            <!-- svelte-ignore missing-declaration -->
            <div class="device-exp">
                <div class="device-figure">
                    <div class="width">
                        {`${window_width_require}px`}<span>{` ( ${window_width}px )`}</span>
                    </div>
                    <div class="height">
                        {`${window_height_require}px`}<span>{` ( ${window_height}px )`}</span>
                    </div>
                    <img
                        src="/img/tcg-sim/require_device.svg"
                        alt="縦:横 = 400px:700px の端末でご利用ください" />
                </div>
            </div>
        </div>
    </section>
{/if}

<style lang="scss">
    #board {
        width: 1050px;
        height: 550px;
        z-index: 1;
        margin: 0 auto 0 200px;
        transform: rotateX(7deg);
        border-radius: 30px;
        position: relative;
        background: radial-gradient(
            ellipse,
            rgba(255, 255, 255, 0.6) 0%,
            rgba(255, 255, 255, 0.4) 70%,
            rgba(255, 255, 255, 0.1) 100%
        );
    }
    #myDeckAndHand {
        position: fixed;
        z-index: 5;
        bottom: 0px;
        left: 0px;
        width: 100%;
        height: 150px;
    }

    #is-not-PC-alert {
        margin: 100px 20px;
        background: black;
        border: solid 1px white;
        border-radius: 20px;
        width: 70%;
        max-width: 600px;

        .clear {
            color: yellow;
        }

        .panel {
            padding: 20px;
            .device-exp {
                color: white;
                position: relative;
                max-width: 310px;
                margin: 50px auto;
                .device-figure {
                    width: 80%;
                    margin: 0 auto;
                    font-size: 18px;
                    span {
                        font-size: 15px;
                        line-height: 18px;
                    }
                    .width {
                        position: absolute;
                        left: 50%;
                        top: -30px;
                        transform: translate(-50%, 0);
                    }
                    .height {
                        position: absolute;
                        top: 50%;
                        right: -55px;
                        transform: rotate(90deg);
                    }
                }
            }
        }
    }
    section {
        position: absolute;
    }
    #pokemon-effect-layor {
        right: -30px;
        bottom: 100px;
        z-index: 4;
        width: 0px;
        height: 100vh;
        font-family: 'Press Start 2P', cursive;
    }
    #pokemon-coin-layor {
        position: fixed;
        font-family: 'Press Start 2P', cursive;
        z-index: 3;
        width: 0;
        height: 0;
        top: 50px;
        left: 10px;
    }
    #pokemon-util-buttons {
        position: fixed;
        z-index: 3;
        width: auto;
        height: auto;
        top: 150px;
        left: 10px;
    }
</style>
