<script lang="ts">
    import { createEventDispatcher } from 'svelte'

    const dispatcher = createEventDispatcher()
    export let img: string = undefined
    export let text: string
    export let size: number = 100
    export let fontsize: number = 13
    export let shape: 'rect' | 'round' = 'rect'
    let isHover: boolean = false
</script>

<div
    class="button"
    style="width:{size}px; height:{size}px;"
    on:click={(event) => {
        dispatcher('click')
    }}>
    <div class="buttonBg {isHover ? 'hover' : ''} {shape}" style="width:{size}px; height:{size}px;" />
    <div class="buttonBody">
        {#if img}<img src={img} alt="" />{/if}
        <p style="font-size: {fontsize}px">{@html text}</p>
    </div>
    <div
        class="buttonMask"
        on:mouseenter={() => {
            isHover = true
        }}
        on:mouseleave={() => {
            isHover = false
        }} />
</div>

<style lang="scss">
    .button {
        position: relative;
        user-select: none;
        .buttonBg {
            position: absolute;
            opacity: 0.9;
            background: rgba($color: #444444, $alpha: 0.8);
            &.rect {
                transform: rotate(45deg);
                transition: 0.2s;
            }
            &.round {
                border-radius: 50%;
            }
            &.hover {
                background: rgba($color: #555555, $alpha: 1);
            }
        }
        .buttonBody {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            position: absolute;
            width: inherit;
            height: inherit;
            img {
                width: 30px;
            }
            p {
                margin: 5px 0;
                text-align: center;
            }
        }
        .buttonMask {
            position: absolute;
            width: inherit;
            height: inherit;
            transform: rotate(45deg);
        }
    }
</style>
