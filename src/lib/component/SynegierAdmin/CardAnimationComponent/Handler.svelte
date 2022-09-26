<script lang="ts">
    import { createEventDispatcher } from 'svelte'
    import type { cardMoveEvent, InArea } from '$lib/model/app/SynegierAdmin'

    const dispatcher = createEventDispatcher()
    export let objectId: number
    export let inArea: InArea
    export let x: number
    export let y: number
    export let z: number
    export let rotate: number = 0
    export let lock: boolean = false
    let preX: number = 0
    let preY: number = 0
    let isMoving: boolean = false

    function onMouseDown() {
        if (!isMoving && !lock) {
            preX = x
            preY = y
            isMoving = true
        }
    }

    function onMouseMove(e: MouseEvent) {
        if (isMoving) {
            x += e.movementX
            y += e.movementY
        }
    }

    function onMouseUp(e: MouseEvent) {
        if (isMoving) {
            isMoving = false
            const eventDetail: cardMoveEvent = {
                objectId: objectId,
                preX: preX,
                preY: preY,
                nowX: x,
                nowY: y,
                mouseEvent: e,
                inArea: inArea
            }
            dispatcher('moved', eventDetail)
        }
    }
</script>

<svelte:window on:mouseup={onMouseUp} on:mousemove={onMouseMove} />

<div
    class="cardHandler {isMoving ? 'disableTransition' : ''}"
    style="top:{y}px; left:{x}px; z-index:{z}; transform:rotate({rotate}deg)"
    on:mousedown={onMouseDown}>
    <slot />
</div>

<style lang="scss">
    .cardHandler {
        position: absolute;
        transition: 0.2s;
        &.disableTransition {
            transition: none;
        }
    }
</style>
