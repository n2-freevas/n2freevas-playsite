<script lang="ts" context="module">
    export const tileWidth = 80
    export const tileHeight = 80
</script>

<script lang="ts">
    import type { Tile } from '$lib/model/app/SynegierAdmin'

    export let model: Tile
</script>

<div class="tile" style="width:{tileWidth}px; height:{tileHeight}px">
    <div class="tileColor {model.type}" />
</div>

<style lang="scss">
    .tile {
        .tileColor {
            --margin: 3px;
            margin: var(--margin);
            width: calc(100% - (var(--margin) * 2));
            height: calc(100% - (var(--margin) * 2));
            background: #4a4b41;
            border: groove 7px #433e2b;
            box-shadow: 0 0 30px #282825;
            transition: 0.1s;
            &:hover {
                background: #a1a57d;
            }
            &.red {
                background: #7a313d;
                border: double 7px rgb(115, 98, 90);
                box-shadow: 0 0 30px #80081c;
                &:hover {
                    background: #cc2642;
                }
            }
            &.safe {
                background: #284c22;
                border: double 8px #628572;
                box-shadow: 0 0 30px #044a1c;
                &:hover {
                    background: #4ea83e;
                }
            }
        }
    }
</style>
