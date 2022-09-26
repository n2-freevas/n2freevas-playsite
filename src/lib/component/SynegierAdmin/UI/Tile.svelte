<script lang="ts" context="module">
    export const tileWidth = 80
    export const tileHeight = 80
</script>

<script lang="ts">
    import type { Tile } from '$lib/model/app/SynegierAdmin'
    import { processingMovement } from '$lib/store/app/synegierAdmin'
    import { createEventDispatcher } from 'svelte'

    export let model: Tile
    export let active: boolean = true
    export let emphasis: boolean = false

    const dispatcher = createEventDispatcher()

    function tileClickHandler() {
        if (active) {
            dispatcher('click', {
                x: model.x,
                y: model.y
            })
        }
    }
</script>

<div class="tile" style="width:{tileWidth}px; height:{tileHeight}px" on:click={tileClickHandler}>
    <div class="tileColor {model.type} {active ? 'active' : ''} {emphasis ? 'emphasis' : ''}" />
</div>

<style lang="scss">
    @keyframes emphasisAnimationNormal {
        0% {
            outline: solid 1px rgb(111, 111, 62);
            opacity: 1;
        }
        70% {
            outline: solid 3px rgb(255, 233, 126);
            opacity: 1;
        }
        100% {
            outline: solid 3px rgb(255, 224, 67);
            opacity: 1;
        }
    }
    .tile {
        .tileColor {
            position: relative;
            --margin: 3px;
            margin: var(--margin);
            width: calc(100% - (var(--margin) * 2));
            height: calc(100% - (var(--margin) * 2));
            background: #4a4b41;
            border: groove 7px #433e2b;
            box-shadow: 0 0 30px #282825;
            transition: 0.1s;
            &.active {
                &:hover {
                    background: #a1a57d;
                }
            }
            &.emphasis {
                &::before {
                    position: absolute;
                    content: '';
                    width: 90%;
                    height: 90%;
                    animation: emphasisAnimationNormal linear 0.8s infinite;
                }
            }
            &.red {
                background: #7a313d;
                border: double 7px rgb(115, 98, 90);
                box-shadow: 0 0 30px #80081c;
                &.active {
                    &:hover {
                        background: #cc2642;
                    }
                }
                &.emphasis {
                }
            }
            &.safe {
                background: #284c22;
                border: double 8px #628572;
                box-shadow: 0 0 30px #044a1c;
                &.active {
                    &:hover {
                        background: #4ea83e;
                    }
                }
                &.emphasis {
                }
            }
        }
    }
</style>
