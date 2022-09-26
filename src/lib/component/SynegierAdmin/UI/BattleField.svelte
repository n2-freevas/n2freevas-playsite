<script lang="ts" context="module">
    const mapWidth: number = 2000
    const mapHeight: number = 1200
    const defaultPerspective: number = 700
    let parentRect: DOMRect
    let mapRect: DOMRect
    let tilesRect: DOMRect
    let defaultCollapse: number = 30
    let defaultScale = 1
    let tilesWidth: number
    let tilesHeight: number
</script>

<script lang="ts">
    import Tile, { tileWidth, tileHeight } from './Tile.svelte'
    import SoldierObject from '$lib/component/SynegierAdmin/Object/SoldierObject.svelte'
    import type { BattleField, Coordinate, Movement, SoldierCardInPlay, SynegierCardInPlay } from '$lib/model/app/SynegierAdmin'
    import { createEventDispatcher, onMount } from 'svelte'
    import { soldiersInPlay } from '$lib/store/app/synegierAdmin'

    export let model: BattleField
    export let thrownCard: SynegierCardInPlay = undefined

    const dispatcher = createEventDispatcher()
    let x: number = 0
    let y: number = 0

    let perspective: number = defaultPerspective
    let collapse: number = 30
    let scale: number = 1
    let isMoving: boolean = false

    let awaitDidMovement = false

    $: {
        if (thrownCard) {
            thrownCardHandler()
            console.log('check!!!!!')
        }
    }

    $: {
        if (!awaitDidMovement) {
            resetTilesActivationAndEmphasis()
        }
    }

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

    // Info Manager
    function generateTileId(x: number, y: number) {
        return `tid_${x}_${y}`
    }

    // Outside Handle Process
    function thrownCardHandler() {
        let canMove = calculateTileAbleToMove($soldiersInPlay[1].coordinate, thrownCard.movement)
        setTilesActivationAndEmphasis(canMove)
        awaitDidMovement = true
    }

    // UI Driver
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

    function selectTileComponent(event) {
        const coordinate: Coordinate = event.detail
        console.log('click', coordinate)
        if (awaitDidMovement) {
            $soldiersInPlay[1].coordinate.x = coordinate.x
            $soldiersInPlay[1].coordinate.y = coordinate.y
            awaitDidMovement = false
        }
    }

    // Movement Handler
    function objectMoveX(x, model: SoldierCardInPlay) {
        let shift = 0
        if (tileWidth > model.size) {
            shift = (tileWidth - model.size) / 2
        } else {
            shift = -1 * ((model.size - tileWidth) / 2)
        }
        return `${tileWidth * x + shift}px`
    }
    function objectMoveY(y: number, model: SoldierCardInPlay) {
        let shift = 0
        if (tileHeight > model.size) {
            shift = (tileHeight - model.size) / 2
        } else {
            shift = -1 * ((model.size - tileHeight) / 2)
        }
        shift = shift + y * (tileHeight / 50)
        return `${tileHeight * y + shift}px`
    }
    function calculateTileAbleToMove(origin: Coordinate, movements: Movement[]): Coordinate[] {
        if (movements == undefined) {
            movements = []
        }
        let result: Coordinate[] = []
        let estimateCoordinates: Coordinate[] = []
        movements.forEach((mov) => {
            estimateCoordinates.push({
                x: origin.x - mov.v,
                y: origin.y - mov.h
            })
        })
        estimateCoordinates.forEach((crd) => {
            let tileId = generateTileId(crd.x, crd.y)
            let tile = model.tiles[tileId]
            console.log(tile, crd.x, crd.y)
            if (tile) {
                result.push({ x: crd.x, y: crd.y })
            }
        })
        return result
    }
    function resetTilesEmphasis() {
        let keys = Object.keys(model.tiles)
        for (let i = 0; i < keys.length; i++) {
            model.tiles[keys[i]].emphasis = false
        }
    }
    function resetTilesActivation() {
        let keys = Object.keys(model.tiles)
        for (let i = 0; i < keys.length; i++) {
            model.tiles[keys[i]].active = false
        }
    }
    function resetTilesActivationAndEmphasis() {
        let keys = Object.keys(model.tiles)
        for (let i = 0; i < keys.length; i++) {
            model.tiles[keys[i]].emphasis = false
            model.tiles[keys[i]].active = false
        }
    }
    function setTilesActivationAndEmphasis(coordinates: Coordinate[]) {
        resetTilesActivationAndEmphasis()
        coordinates.forEach((coordinate) => {
            let tileId = generateTileId(coordinate.x, coordinate.y)
            if (model.tiles[tileId]) {
                model.tiles[tileId].active = true
                model.tiles[tileId].emphasis = true
            }
        })
    }
</script>

<svelte:window on:mouseup={onMouseUp} on:mousemove={onMouseMove} />

{#if model}
    <div
        id="map"
        style="top:{y}px; left:{x}px; width:{mapWidth}px; height:{mapHeight}px;"
        on:mousedown|self={onMouseDown}
        on:dblclick|stopPropagation={dblClickHandler}>
        <div
            id="field"
            style="
                --width:{tilesWidth}px; --height:{tilesHeight}px;
                --gridWidth:{tileWidth}px; --gridHeight: {tileHeight}px;
                top:50%;left:50%;
                transform-origin:center;
                transform: scale({scale}) translate(-50%, -50%) perspective({perspective}px) rotateX({collapse}deg);
            ">
            <div id="tiles" on:mousedown|self={onMouseDown}>
                {#each Object.entries(model.tiles) as [tileId, pos]}
                    <div id={tileId} style="grid-row:{pos.y + 1}/{pos.y + 2}; grid-column:{pos.x + 1}/{pos.x + 2};">
                        <Tile model={pos} bind:active={pos.active} bind:emphasis={pos.emphasis} on:click={selectTileComponent} />
                    </div>
                {/each}
            </div>
            {#each Object.entries($soldiersInPlay) as [id, sol]}
                <div class="soldierHandler" style="top:{objectMoveY(sol.coordinate.y, sol)}; left:{objectMoveX(sol.coordinate.x, sol)};">
                    <SoldierObject model={sol} />
                </div>
            {/each}
        </div>
    </div>
{/if}

<style lang="scss">
    #map {
        position: absolute;
        #field {
            position: absolute;
            width: var(--width);
            height: var(--height);
            .soldierHandler {
                transition: 0.2s;
                position: absolute;
            }
            #tiles {
                display: grid;
                grid-template-rows: var(--gridWidth) var(--gridHeight);
                // position: absolute;
            }
        }
    }
</style>
