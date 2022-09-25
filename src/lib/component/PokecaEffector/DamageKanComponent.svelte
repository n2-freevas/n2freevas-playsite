<script lang="ts">
    import type { DamageKan } from '$lib/model/app/PokemonCardGameEffectorStore'
    import { createEventDispatcher } from 'svelte'

    export let model: DamageKan = {
        id: 1,
        x: 0,
        y: 0,
        counter: 0
    }
    const init_size = 100
    const init_font_size = 30
    const init_color = [255, 200, 0]
    let size = init_size
    let font_size = init_font_size
    let scale = 1
    let color = init_color
    let effect_1_action = false
    let effect_2_action = false
    let moving: boolean = false
    let moved_flag = false

    function mouseDownHandler() {
        if (!moving) {
            moving = true
            moved_flag = false
        }
    }
    function mouseMoveHandler(event: MouseEvent) {
        if (moving) {
            moved_flag = true
            model.x += event.movementY
            model.y += event.movementX
        }
    }
    function mouseUpHandler() {
        if (moving) {
            moving = false
        }
    }
    function damekanEffectHandler() {
        if (!effect_1_action) {
            effect_1_action = true
            window.setTimeout(() => {
                effect_1_action = false
            }, 400)
        } else if (!effect_2_action) {
            effect_2_action = true
            window.setTimeout(() => {
                effect_2_action = false
            }, 400)
        }
    }
    function clickHandler(event) {
        if (!moved_flag) {
            if (event.layerY < size / 2) {
                if (model.counter <= 450) {
                    model.counter += 50
                } else {
                    model.counter = 500
                }
            } else {
                if (model.counter >= 50) {
                    model.counter -= 50
                } else {
                    model.counter = 0
                }
            }
            damekanEffectHandler()
        }
    }
    function rightClickHandler(event) {
        if (!moved_flag) {
            if (event.layerY < size / 2) {
                if (model.counter <= 490) {
                    model.counter += 10
                }
            } else {
                if (model.counter >= 10) {
                    model.counter -= 10
                }
            }
            damekanEffectHandler()
        }
    }
    $: {
        color[1] = 200 - model.counter / 2
        scale = 1 + model.counter / 1000
    }
</script>

<svelte:window on:mouseup|stopPropagation={mouseUpHandler} on:mousemove|stopPropagation={mouseMoveHandler} />

<div
    class="damage_kan"
    style="--id:{model.id};--x:{model.x}px; --y:{model.y}px; --size:{size}px; --scale:{scale};"
    on:mousedown|stopPropagation={mouseDownHandler}
    on:click={clickHandler}
    on:contextmenu|preventDefault={rightClickHandler}>
    <img src="/img/pokeca/icon_white.svg" alt="" />
    <div class="damege_kan_mask" style="--color:rgb({color[0]},{color[1]},{color[2]})" />
    <div class="effect-1 {effect_1_action ? 'action-1' : ''}" />
    <div class="effect-2  {effect_2_action ? 'action-2' : ''}" />
    <p style="--font_size:{font_size}px">{model.counter}</p>
</div>

<style lang="scss">
    .damage_kan {
        position: absolute;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: var(--id);
        top: var(--x);
        left: var(--y);
        width: var(--size);
        height: var(--size);
        border-radius: calc(var(--size) / 2);
        background: linear-gradient(45deg, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.4));
        // overflow: hidden;
        transform-origin: 50%, 50%;
        transform: scale(var(--scale));
        user-select: none;
        img {
            z-index: 1;
            position: absolute;
            width: 100%;
        }
        .damege_kan_mask {
            z-index: 2;
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: calc(var(--size) / 2);
            background-color: var(--color);
            opacity: 0.8;
        }
        .effect-1,
        .effect-2 {
            position: absolute;
            width: var(--size);
            height: var(--size);
            border-radius: calc(var(--size) / 2);
            border-style: solid;
            border-width: 3px;
            opacity: 0;
            transform: scale(1);
        }
        .effect-1 {
            z-index: 3;
            border-color: #ffd000;
            &.action-1 {
                animation: damekanEffect 0.3s ease-out;
            }
        }
        .effect-2 {
            z-index: 4;
            border-color: #fe5420;
            &.action-2 {
                animation: damekanEffect 0.3s ease-out;
            }
        }
        @keyframes damekanEffect {
            0% {
                transform: scale(1);
                border-width: 5px;
                opacity: 1;
            }
            50% {
                transform: scale(1.2);
                border-width: 5px;
                opacity: 1;
            }
            100% {
                transform: scale(1.2);
                border-width: 0px;
                opacity: 0;
            }
        }
        p {
            z-index: 5;
            color: white;
            font-size: var(--font_size);
            font-weight: bold;
            text-shadow: 3px 3px 2px black;
        }
    }
</style>
