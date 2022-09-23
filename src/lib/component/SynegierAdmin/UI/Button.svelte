<script lang="ts">
    import { createEventDispatcher } from 'svelte'

    const dispatcher = createEventDispatcher()
    export let img: string = undefined
    export let text: string
    export let size: number = 100
    let isHover: boolean = false
</script>

<div
    class="button"
    style="width:{size}px; height:{size}px;"
    on:click={() => {
        dispatcher('click')
    }}>
    <div class="buttonBg {isHover ? 'hover' : ''}" style="width:{size}px; height:{size}px;" />
    <div class="buttonBody">
        {#if img}<img src={img} alt="" />{/if}
        <p>{@html text}</p>
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
        .buttonBg {
            position: absolute;
            opacity: 0.9;
            background: rgba($color: #444444, $alpha: 0.8);
            transform: rotate(45deg);
            transition: 0.2s;
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
                font-size: 13px;
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
