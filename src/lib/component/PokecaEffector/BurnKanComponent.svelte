<script lang="ts">
    import type { BurnKan } from '$lib/model/app/PokemonCardGameEffectorStore'
    export let model: BurnKan
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

<div class="burn_marker" style="--id:{model.id};--x:{model.x}px; --y:{model.y}px;">
    <div class="body {animate ? 'mouse_up_action' : ''}" on:mousedown|stopPropagation={mouseDownHandler}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 358 391"
            ><path
                d="M170.5 319.9V391a172 172 0 0 1-53.4-9.7c-2.5-18.3-4-34-4.8-47.4 6-2.2 10.6-7.3 12-13.6l.2-.4h46Zm10.4 0h45.6c1.4 6.6 6.3 12 12.6 14.1-.8 13.3-2.3 29-4.7 47.2-16 5.7-34.1 9.2-53.5 9.8v-71.1Zm157.9-83c0 7-.3 15-1 22.5l.3.3.3.4.7.8 1 1.3c2.2 2.5 4.4 5.2 6.2 8.2 7.5 12.4 7.7 34 7.7 40.6l4-8.1v43.4c0 15.2-11.7 34.7-25.8 34.7-14 0-25.2-19.5-25.2-34.7a327 327 0 0 1 4.2-35c0-6.1 1-17.7 11.8-31.5 3.6-4.6 7-12.7 10.2-22.3l.2-.7-.2-1-.4-2.3-.2-1.1-.2-.3c-5-8.5-7.3-20.1.1-42.7 17.5-53 15.4-11.5 6.3 27.6Zm-319.9-1c-8.9-38.8-10.7-79 6.6-26.5 7.4 22.6 5.2 34.2 0 42.7v.3l-.3 1-.4 2.3-.2 1.1.2.7A78.5 78.5 0 0 0 35 279.8a49.8 49.8 0 0 1 11.8 31.4 327 327 0 0 1 4.2 35c0 15.3-11.1 34.8-25.2 34.8S0 361.5 0 346.3v-43.4l4 8.1c0-6.6.2-28.2 7.7-40.6 1.8-3 4-5.7 6.2-8.2l1-1.3.7-.8.3-.4.3-.3-.1-1.3c-.6-7.1-1-14.7-.9-21.1Zm90.2 18c-3 16.4-5 30.8-6.2 43.1a19.1 19.1 0 0 0-.2 37.8c1 12.3 3 26.7 6.2 43.3C77.6 364.6 57 341.8 57 316c0-25.7 20.4-48.4 51.5-62l.6-.2Zm133.2.1c31.2 13.5 51.7 36.2 51.7 62 0 25.7-20.4 48.4-51.5 61.9 3.1-16.5 5.2-30.9 6.2-43.2a19.1 19.1 0 0 0-.2-37.6 512.8 512.8 0 0 0-6.1-42.8v-.3Zm94.3 14.9c-.3 2-.6 4-1 5.7-2.2 9.8-6.8 9.8-12 20.3a88.8 88.8 0 0 0-7.5 21.1l6.8 13.6 9.6-26.7 11.8 25.6c2.6-3.4 4-8 4.2-13.2v-.7c0-3.1-.4-23.6-6-32.6-2-3-3.9-7.4-5.6-12.3l-.2-.7v-.1Zm-315.2 0v.1l-.3.7c-1.7 5-3.7 9.2-5.6 12.3-5.6 9-6 29.5-6 32.6v.7c.1 5.2 1.6 9.8 4.2 13.2l11.8-25.6 9.6 26.7L42 316c-.7-4.8-4-13.8-7.5-21-5.2-10.6-9.8-10.6-12-20.4l-1-5.6v-.1Zm207-219c-31.8 29-45 42.5-50 50a27 27 0 0 0 .3 11.9l.7.1 1.4.3c23.2 5 44.3 10.8 41.9 25.6 4.7 4.1 6.2 9.7 2.3 17.4l-3.2 6.7-.4 1c11-.6 34-7.3 75-22.3 23.6-8.6-49.5 74-105.9 94l4 7.3h.6l29.9-23.8v29.7c3.2.9 6.2 1.9 9.2 3 2.3 18.2 4 33.9 4.7 47a19.1 19.1 0 0 0-12.3 13.8v.3h-45.7V252h-10.4v60h-46c-1.4-6.5-6-11.8-12-14a748 748 0 0 1 4.7-47.4c2.9-1 5.8-2 8.8-2.8v-14.2c-30.1-8.8-46.8-27.6-47-52.3-.2-23.2 40.7-68 30.7-40.7-12 32.3 31.6 21.8 44.1 7.3 10-11.6 15.7-19.3 18.9-24.7l.1-.3c-18.4-3.7-33.8-8.3-31.6-19.6l.1-.6c-11-4-17.9-9.5-15.5-18.2 8.4-31 231.6-151.3 102.7-34.5Zm105.7 204.7-.4 1.2-.3 1c.8 3.8 1.7 7.4 2.8 10.8l.3.9.1.4.1-.7 1-7.7v-1.1l-.5-.8-2.4-3-.6-.8-.1-.2Zm-310.2 0-.1.2-.6.8-2.4 3-.6.8.1 1.1 1 7.7v.7l.2-.4.3-1c1-3.3 2-7 2.8-10.7l-.2-.5-.1-.5-.4-1.2Zm309.5-28.2c-2.3 7.7-2.2 17-.8 26l.9 1.3.4.7.2.2.1-.4c1.5-5 3-10.3 4.2-15.6l.4-1.6v-.4c-.1-13.8-1.8-22.3-5.4-10.2Zm-308.8 0c-3.6-12-5.3-3.6-5.4 10.2v.4l.4 1.6c1.3 5.3 2.7 10.6 4.2 15.6l.1.4.2-.2.4-.7 1-1.3v-.8a60.6 60.6 0 0 0-.9-25.2Zm126.6 11.8 4.7 3.8 1.8-3.3-6.5-.5ZM184 125.1l.3.6c3 8 3.5 18-8.6 37.5-7.5 12-56.8 46.1-49.7 19.2 6-22.7-20.3-10.4-20.2 9 .1 15 8 27.2 20.2 35.6V218l23.5 18.8a83 83 0 0 0 8.4 1.5l17.3-31.4 14.2 25.6c35.3-18.3 80.4-69 67.3-62.4-42.4 21.5-41.4 7.2-35.3-7.4-11.3.6-10.1-5.2-3.4-14.9 2.6-3.6 4-6.9 4.6-9.8v-.3c-6.7-6-20-9-34-11.8l-1.3-.3-1.4-.3-.7-.1-1.2-.2Zm-7.8-13.8v.2c.4 2.3 0 5.4-3.4 11.4l11 2.1h.2c-1.6-4.1-3.8-7.9-5.1-12.4l-.2-.8-1.8-.4-.7-.1Zm-34.8-8.8v.2l.7.3c8.3 3 19 5.2 29.7 7.4l3.4.7 1 .2v-.1l-.4-1.7-.1-.4c-.6-2.1-.7-4.2 2.4-9l.3-.3c1.8-9.6 8.5-23 25.4-44.4 76.5-96.2-55 19.7-62.4 47.1Z"
                fill="#000"
                fill-rule="evenodd" /></svg>
    </div>
    {#if model.active}
        <div class="effect">
            <img src="/img/pokeca/burn_effect.png" alt="" />
        </div>
    {/if}
</div>

<style lang="scss">
    .burn_marker {
        position: absolute;
        top: var(--x);
        left: var(--y);
        width: 70px;
        height: 70px;
        user-select: none;
        .body {
            position: absolute;
            z-index: var(--id);
            display: flex;
            width: 100%;
            height: 100%;
            justify-content: center;
            border-radius: 35px;
            background: linear-gradient(45deg, #ff006f, #ff921d);
            border: solid 2px rgb(202, 0, 0);
            transform-origin: 50%, 50%;
            transform: scale(1);
            &.mouse_up_action {
                animation: iconInPlay 1s ease-in-out;
            }
            svg {
                position: absolute;
                top: -5px;
                width: 90%;
                height: 90%;
                margin-bottom: 20px;
            }
        }
        .effect {
            user-select: none;
            img {
                position: absolute;
                top: -70px;
                left: -20px;
            }
        }
    }

    @keyframes iconInPlay {
        0% {
            transform: scale(1) rotateX(0);
        }
        80% {
            transform: scale(2) rotateX(1080deg);
        }
        100% {
            transform: scale(1) rotateX(1080deg);
        }
    }
</style>
