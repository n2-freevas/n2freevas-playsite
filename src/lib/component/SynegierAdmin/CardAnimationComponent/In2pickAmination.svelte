<script lang="ts">
    export let onAppear: boolean = false
    export let onChoised: boolean = false
    export let onUnChoised: boolean = false
    export let delay: number = 0
    let onAppearDriver: boolean = false
    let onChoisedDriver: boolean = false
    let onUnChoisedDriver: boolean = false
    let onDelayDriver: number = 0
    $: {
        onAppearDriver = onAppear
    }
    $: {
        onChoisedDriver = onChoised
    }
    $: {
        onUnChoisedDriver = onUnChoised
    }
    $: {
        onDelayDriver = delay
    }
</script>

<div
    class="anime
    {onAppearDriver ? 'onAppear' : ''}
    {onChoisedDriver ? 'onChoised' : ''}
    {onUnChoisedDriver ? 'onUnChoised' : ''}"
    style="--delay:{onDelayDriver}s">
    <slot />
    <div class="flash {onChoisedDriver ? 'onChoised' : ''}" />
</div>

<style lang="scss">
    .anime {
        position: relative;
        top: 20px;
        opacity: 0;
        transition: 0.3s;
        &.onAppear {
            animation: appear ease-in-out forwards 0.3s var(--delay);
            &:hover {
                top: 0px;
            }
        }
        &.onChoised {
            &:hover {
                top: 0;
            }
            animation: selected ease-in-out forwards 0.5s var(--delay);
        }
        &.onUnChoised {
            &:hover {
                top: 0;
            }
            animation: disappear ease-in-out forwards 0.3s var(--delay);
        }
        .flash {
            position: absolute;
            z-index: -1;
            top: -15%;
            left: -15%;
            width: 130%;
            height: 130%;
            background: radial-gradient(closest-side, rgba(#ffffff, 1), rgba(#000000, 0));
            opacity: 0;
            border-radius: 50%;
            transform-origin: center;
            &.onChoised {
                animation: flash ease-in-out 0.5s;
            }
        }
    }
    @keyframes appear {
        0% {
            opacity: 0;
            top: 50px;
        }
        100% {
            opacity: 1;
            top: 0;
        }
    }
    @keyframes selected {
        0% {
            opacity: 1;
            transform: scale(1);
        }
        100% {
            opacity: 1;
            transform: scale(1.5);
        }
    }
    @keyframes flash {
        0% {
            opacity: 0;
            transform: scale(1);
        }
        50% {
            opacity: 1;
            transform: scale(1.2);
        }
        100% {
            opacity: 0;
            transform: scale(1.4);
        }
    }
    @keyframes disappear {
        0% {
            opacity: 1;
            transform: scale(1);
        }
        100% {
            opacity: 0;
            transform: scale(0);
        }
    }
</style>
