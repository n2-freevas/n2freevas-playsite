<script lang="ts">
    import type { PoisonKan } from '$lib/model/app/PokemonCardGameEffectorStore'
    export let model: PoisonKan
    let moving: boolean = false
    let animate: boolean = false

    function mouseDownHandler() {
        console.log('check')
        if (!moving) {
            moving = true
        }
    }
    function mouseMoveHandler(event: MouseEvent) {
        if (moving) {
            model.x += event.movementY
            model.y += event.movementX
        }
    }
    function mouseUpHandler() {
        if (moving) {
            moving = false
            animate = true
            window.setTimeout(() => {
                animate = false
                model.active = true
            }, 1100)
        }
    }
</script>

<svelte:window on:mouseup|stopPropagation={mouseUpHandler} on:mousemove|stopPropagation={mouseMoveHandler} />

<div class="poison_marker" style="--id:{model.id};--x:{model.x}px; --y:{model.y}px;">
    <div class="body {animate ? 'mouse_up_action' : ''}" on:mousedown|stopPropagation={mouseDownHandler}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 522 416"
            ><path
                d="M295.3 5.1 339.6 45c13.6 12.2 5.8 20.9 2 25l-8.9 10a170.9 170.9 0 0 1 33 71.8c1.8-1.2 3.5-2.4 5.3-3.4l-4.3-8.5c-1.3-2.6-5.1-10 .7-13l22.8-11.7c7-3.5 10.5 3.2 12.2 6.5l7 13.8a94.2 94.2 0 0 1 57.8 12.4l9.7-10.7c2-2.2 7.8-8.7 12.7-4.3l19 17.1c5.9 5.3.6 11-2 14l-9.9 11a94 94 0 0 1 13.9 79.7l2.8 1.3c2.6 1.2 10.3 4.6 7.7 10.6L510.7 290c-3.2 7.1-10.2 4-13.6 2.5l-5.2-2.3a94.4 94.4 0 0 1-53.7 32l-8.3 14.3-.4-.3-7.6 13.1a43 43 0 1 1-78.9 24.8 29 29 0 0 1-1-.3L299.3 359v-.1l-38-13.1-1.4-.5c-19 7.8-39.6 12.5-61.2 13.5l-1.2 18c-.3 4.3-1.2 17.2-10.8 16.5l-21.3-1.5-1.8-.1-14.6-1c-11.6-.8-10.8-12.4-10.4-18.1l1.5-20.5c-31.8-9-60-26.3-81.8-49.3L46.4 312c-3.5 2.7-13.6 10.7-19.6 3.1l-12.5-16-1.7-2.2-9-11.6c-7.2-9.1 2-16.3 6.5-19.8l15.3-12A169.8 169.8 0 0 1 41.8 87.3L25.3 66c-2.7-3.5-10.6-13.6 1.3-23 6.6-5 15.8-12.3 25.1-19.5l1.5-1.2.7-.6 1.7-1.3 18-14C87.9-5 95 4.3 98.5 8.7l14.8 19A183 183 0 0 1 258 24l14.6-16.1c3-3.3 11.6-12.9 22.8-2.8Zm44.5 275.2-.6.9a177.4 177.4 0 0 1-47 46.7l20.6 7.1v.1l38 13.1a43 43 0 0 1 56-12.8l6.3-10.9.4.3.6-1a94.4 94.4 0 0 1-74.3-43.5Zm-64.1-97.5c-3-6-10.5-8.5-16.6-5.5l-69 34.4-68.2-34.4a12.3 12.3 0 1 0-11 22.1l52 26.1-52 26a12.4 12.4 0 0 0 11 22.2l68.3-34.4 69 34.4a12.3 12.3 0 1 0 11-22.1l-52-26.1 52-26c6-3.1 8.5-10.5 5.5-16.7ZM189.8 77c-30.4 0-55.8 22-55.8 49.3a48.7 48.7 0 0 0 24.8 41v8.4c0 6.8 5.9 12.3 12.4 12.3h37.6c6.8 0 12.4-5.5 12.4-12.3v-8.4a48 48 0 0 0 24.8-41c0-27.2-25-49.3-56.2-49.3Zm-21.3 43c7.3 0 12.5 5.6 12.5 12.5 0 7-5.2 12.5-12.5 12.5-6.6 0-12.5-5.6-12.5-12.5 0-7 6-12.5 12.5-12.5Zm44 0a12.5 12.5 0 1 1 0 25 12.5 12.5 0 0 1 0-25Z"
                fill="#000"
                fill-rule="evenodd" /></svg>
    </div>
    {#if model.active}
        <div class="effect">
            <img src="/img/pokeca/poison_effect.png" alt="" />
        </div>
    {/if}
</div>

<style lang="scss">
    .poison_marker {
        position: absolute;
        top: var(--x);
        left: var(--y);
        width: 70px;
        height: 70px;
        .body {
            position: absolute;
            z-index: var(--id);
            display: flex;
            align-items: center;
            padding: 5px;
            width: 100%;
            height: 100%;
            border-radius: 35px;
            background: linear-gradient(45deg, #b051b7, #ff0088);
            border: solid 2px rgb(106, 0, 56);
            transform-origin: 50%, 50%;
            transform: scale(1);
            &.mouse_up_action {
                animation: iconInPlay 1s ease-in-out;
            }
        }
        .effect {
            user-select: none;
            img {
                position: absolute;
                top: -40px;
                left: -20px;
            }
        }
    }

    @keyframes iconInPlay {
        0% {
            transform: scale(1) rotateY(0);
        }
        80% {
            transform: scale(2) rotateY(1080deg);
        }
        100% {
            transform: scale(1) rotateY(1080deg);
        }
    }
</style>
