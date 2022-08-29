<script lang="ts">
    import { MovementMap } from '$lib/model/app/SynegierAdmin'
    import type { Movement } from '$lib/model/app/SynegierAdmin'

    export let movement: Movement[]
    export let redTiles: Movement[]
    export let scale: number = 1
    export let showBlankTile: boolean = false
</script>

<div class="movementInfo" style="--scale:{scale}">
    {#each MovementMap as mm}
        {#if mm.v == 0 && mm.h == 0}
            <div class="center" />
        {:else if movement?.find((m) => m.v == mm.v && m.h == mm.h)}
            <div class="active" />
        {:else if redTiles?.find((m) => m.v == mm.v && m.h == mm.h)}
            <div class="red" />
        {:else}
            <div class={showBlankTile ? 'blank' : ''} />
        {/if}
    {/each}
</div>

<style lang="scss">
    .movementInfo {
        --movementBoxWidth: calc(120px * var(--scale)); //Card.svelteコンポーネントと共用なので注意
        --movementBoxHeight: calc(120px * var(--scale));
        --movementCellMargin: calc(2px * var(--scale));
        --movementCellWidth: calc((var(--movementBoxWidth) - (var(--movementCellMargin) * 14)) / 7);
        --movementCellHeight: calc(
            (var(--movementBoxHeight) - (var(--movementCellMargin) * 14)) / 7
        );
        width: var(--movementBoxWidth);
        height: var(--movementBoxHeight);
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        div {
            width: var(--movementCellWidth);
            height: var(--movementCellHeight);

            margin: var(--movementCellMargin);
            &.center {
                position: relative;
                background: white;
                &::before {
                    content: '';
                    position: absolute;
                    width: calc(var(--movementCellWidth) * 0.6);
                    height: calc(var(--movementCellHeight) * 0.6);
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: #444444;
                }
            }
            &.active {
                background: white;
            }
            &.red {
                background: red;
            }
            &.blank {
                border: solid 1px #555555;
            }
        }
    }
</style>
