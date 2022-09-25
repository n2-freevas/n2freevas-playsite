<script>
    export let width = 100
    export let font_size = 20
    export let active = false
    export let duration = 2
    export let left_roll_in = false
</script>

<div
    style="--width:{width}px; --duration:{duration}s; --font_size:{font_size}px"
    class="fukidashi {active ? 'active' : ''} {left_roll_in ? 'left_roll_in' : ''}">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 566 373"
        ><g fill="none" fill-rule="evenodd"
            ><path fill="#FFF" d="M76.2 72.5 296.9.8 566 72.5l-93.9 209.1H241.2l-165 90.6 55.7-90.6L0 295.4l62.4-81.3z" /><path
                fill="#000"
                d="M92 77 298.8 9.8 551 77l-88 196H239L98 348.1l54-75-131.4 12.7 58.4-76z" /><path fill="#FFF" d="M161.4 27.2 527.2 82 414.3 254H79z" /></g
        ></svg>
    <p><slot /></p>
</div>

<style lang="scss">
    .fukidashi {
        position: relative;
        width: var(--width);
        opacity: 0;
        &.active {
            opacity: 1;
        }
        &.left_roll_in {
            transform-origin: 0% 100%;
            animation: leftRollIn var(--duration);
        }
        p {
            position: absolute;
            color: black;
            top: 40%;
            left: 52%;
            transform: translate(-50%, -50%);
            font-size: var(--font_size);
        }
    }
    @keyframes leftRollIn {
        0% {
            opacity: 0;
            transform: rotate(-60deg);
        }
        10% {
            opacity: 1;
            transform: rotate(0deg);
        }
        90% {
            opacity: 1;
        }
        100% {
            opacity: 0;
            transform: rotate(0deg);
        }
    }
</style>
