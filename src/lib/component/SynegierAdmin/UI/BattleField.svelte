<script lang="ts" context="module">
</script>

<script lang="ts">
    import type { BattleField } from '$lib/model/app/SynegierAdmin'
    import { createEventDispatcher, onMount } from 'svelte'
    import Tile, { tileWidth, tileHeight } from './Tile.svelte'
    export let model: BattleField

    const dispatcher = createEventDispatcher()
    const mapWidth: number = 2000
    const mapHeight: number = 1200
    const defaultPerspective: number = 700
    let defaultCollapse: number = 30
    let defaultScale = 1

    let tilesWidth: number
    let tilesHeight: number
    let x: number = 0
    let y: number = 0

    let perspective: number = defaultPerspective
    let collapse: number = 30
    let scale: number = 1
    let isMoving: boolean = false

    let parentRect: DOMRect
    let mapRect: DOMRect
    let tilesRect: DOMRect

    onMount(() => {
        parentRect = document.getElementById('map').parentElement.getBoundingClientRect()
        mapRect = document.getElementById('map').getBoundingClientRect()
        tilesRect = document.getElementById('tiles').getBoundingClientRect()
        console.log('BattleField:parent', parentRect)
        console.log('BattleField:map', mapRect)
        console.log('BattleField:tiles', tilesRect)
        tilesWidth = model.width * tileWidth
        tilesHeight = model.height * tileHeight
        y = -1 * (mapRect.height - parentRect.height + 100)
        x = -1 * ((mapRect.width - parentRect.width) / 2)
        defaultScale = 1 - y / 1000
        defaultCollapse = 30 - y / 100
    })

    function onMouseDown() {
        if (!isMoving) {
            isMoving = true
        }
    }
    function onMouseMove(e: MouseEvent) {
        if (isMoving) {
            x += e.movementX * 1.5
            y += e.movementY * 1.5
            scale = defaultScale + y / 1000
            collapse = defaultCollapse + y / 100
        }
    }

    function onMouseUp() {
        if (isMoving) {
            isMoving = false
        }
    }

    function dblClickHandler(event) {
        dispatcher('dblclick', event)
    }
</script>

<svelte:window on:mouseup={onMouseUp} on:mousemove={onMouseMove} />

{#if model}
    <div
        id="map"
        style="top:{y}px; left:{x}px; width:{mapWidth}px; height:{mapHeight}px;"
        on:mousedown={onMouseDown}
        on:dblclick|stopPropagation={dblClickHandler}>
        <div
            id="tiles"
            style="
            width:{tilesWidth}px; height: {tilesHeight}px;
            display: grid;
            grid-template-rows: {tileWidth}px {tileHeight}px;
            top:50%;left:50%;
            transform-origin:center;
            transform: scale({scale}) translate(-50%, -50%) perspective({perspective}px) rotateX({collapse}deg);
        ">
            {#each model.tiles as pos}
                <div style="grid-row:{pos.y + 1}/{pos.y + 2}; grid-column:{pos.x + 1}/{pos.x + 2};">
                    <Tile model={pos} />
                </div>
            {/each}
        </div>
    </div>
{/if}

<style lang="scss">
    #map {
        position: absolute;
        #tiles {
            position: absolute;
        }
    }
</style>
