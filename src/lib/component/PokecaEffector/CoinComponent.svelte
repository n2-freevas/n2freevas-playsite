<script>
    import FukidashiConponent from './FukidashiConponent.svelte'

    let flip = false
    let openBackFlip = false
    let openFrontFlip = false
    let flipping = false
    let fukidashi_roll_in = false
    let fukidashi_string = 'Head'
    function getRandomInt(max) {
        return Math.floor(Math.random() * max)
    }
    function coinToss() {
        if (!flipping) {
            flipping = true
            fukidashi_roll_in = false
            //表を出す
            if (getRandomInt(100) % 2 == 0) {
                openFrontFlip = true
                flip = false
                fukidashi_string = 'Head'
            }
            //裏を出す
            else {
                openBackFlip = true
                flip = true
                fukidashi_string = 'Tail'
            }
            window.setTimeout(() => {
                fukidashi_roll_in = true
                flipping = false
                openFrontFlip = false
                openBackFlip = false
            }, 1100)
            window.setTimeout(() => {
                fukidashi_roll_in = false
            }, 6000)
        }
    }
</script>

<div class="coin_result_fukidashi">
    <FukidashiConponent width={150} left_roll_in={fukidashi_roll_in}>
        {fukidashi_string}
    </FukidashiConponent>
</div>
<div
    class="coin {flip ? 'flip' : ''} {openFrontFlip ? 'openFrontFlip' : ''} {openBackFlip
        ? 'openBackFlip'
        : ''}"
    on:click={coinToss}>
    <div class="front">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 284 284"
            ><g fill="none" fill-rule="evenodd"
                ><circle fill="#000" cx="142" cy="142" r="142" /><circle
                    fill="#F2EE9D"
                    cx="142.5"
                    cy="142.5"
                    r="131.5" /><path
                    d="M92.2 21C114 29.8 125 36 125 39.4c0 1.8-6.3 5.5-13 9.3l-1.3.7c-7.2 4-14.3 8.2-14.3 10 0 2 7.4 6.4 14.7 10.7l.9.5c6.7 4 13 8 13 10.1 0 3.3-71.6 71.5-71.6 104 0 12 14.7 39.2 44.2 81.3A130.5 130.5 0 0 1 34.9 64.5c2-2.7 3-6.4 3.9-10.1l.4-1.5c1-4.5 2.2-8.8 5-11.5 5.2-4.9 17-3.4 23-7.4 7.6-5 15.8-9.4 24.5-12.8Z"
                    fill="#C0A06E" /><path
                    d="M192.8 21C171 29.8 160 36 160 39.4c0 1.8 6.3 5.5 13 9.3l1.3.7c7.2 4 14.3 8.2 14.3 10 0 2-7.4 6.4-14.7 10.7l-.9.5c-6.7 4-13 8-13 10.1 0 3.3 71.6 71.5 71.6 104 0 12-14.7 39.2-44.2 81.3a130.5 130.5 0 0 0 62.7-201.5c-2-2.7-3-6.4-3.9-10.1l-.4-1.5c-1-4.5-2.2-8.8-5-11.5-5.2-4.9-17-3.4-23-7.4-7.6-5-15.8-9.4-24.5-12.8Z"
                    fill="#6B6B6B" /><g transform="translate(54 106)"
                    ><circle fill="#000" cx="27.5" cy="27.5" r="27.5" /><circle
                        fill="#FFF"
                        cx="27.7"
                        cy="27.3"
                        r="10.5" /></g
                ><g transform="translate(175 106)"
                    ><circle fill="#000" cx="27.5" cy="27.5" r="27.5" /><circle
                        fill="#FFF"
                        cx="27.7"
                        cy="27.3"
                        r="10.5" /></g
                ><circle fill="#E9ACB5" cx="49" cy="174" r="24" /><circle
                    fill="#E9ACB5"
                    cx="233"
                    cy="180"
                    r="24" /><ellipse fill="#000" cx="142.5" cy="170.5" rx="7.5" ry="3.5" /></g
            ></svg>
    </div>
    <div class="back">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 284 284"
            ><g fill="none" fill-rule="evenodd"
                ><circle fill="#000" cx="142" cy="142" r="142" /><circle
                    fill="#805593"
                    cx="142.5"
                    cy="142.5"
                    r="131.5" /><path
                    d="M92.2 21C114 29.8 125 36 125 39.4c0 1.8-6.3 5.5-13 9.3l-1.3.7c-7.2 4-14.3 8.2-14.3 10 0 2 7.4 6.4 14.7 10.7l.9.5c6.7 4 13 8 13 10.1 0 3.3-71.6 71.5-71.6 104 0 12 14.7 39.2 44.2 81.3A130.5 130.5 0 0 1 34.9 64.5c2-2.7 3-6.4 3.9-10.1l.4-1.5c1-4.5 2.2-8.8 5-11.5 5.2-4.9 17-3.4 23-7.4 7.6-5 15.8-9.4 24.5-12.8ZM192.8 21C171 29.8 160 36 160 39.4c0 1.8 6.3 5.5 13 9.3l1.3.7c7.2 4 14.3 8.2 14.3 10 0 2-7.4 6.4-14.7 10.7l-.9.5c-6.7 4-13 8-13 10.1 0 3.3 71.6 71.5 71.6 104 0 12-14.7 39.2-44.2 81.3a130.5 130.5 0 0 0 62.7-201.5c-2-2.7-3-6.4-3.9-10.1l-.4-1.5c-1-4.5-2.2-8.8-5-11.5-5.2-4.9-17-3.4-23-7.4-7.6-5-15.8-9.4-24.5-12.8Z"
                    fill="#6B6B6B" /><circle fill="#E9ACB5" cx="49" cy="174" r="24" /><circle
                    fill="#E9ACB5"
                    cx="233"
                    cy="174"
                    r="24" /><ellipse fill="#000" cx="142.5" cy="170.5" rx="7.5" ry="3.5" /><path
                    d="M41.7 94.7a257.3 257.3 0 0 0 34.8 23.6c9.5 5.1 25 12.4 46.5 21.7-24.7 16.9-44 21.4-58 13.5-14-7.9-21.7-27.5-23.3-58.8Z"
                    fill="#000" /><path
                    d="M47.6 102c11.4 8.9 21.2 15.5 29.2 19.8 8 4.3 21 10.4 39.1 18.2-20.8 14.3-37 18.1-48.8 11.5C55.4 145 49 128.4 47.6 102Z"
                    fill="#C52621" /><g
                    ><path
                        d="M243 94.7a257.3 257.3 0 0 1-34.7 23.6c-9.6 5.1-25 12.4-46.5 21.7 24.7 16.9 44 21.4 58 13.5 14-7.9 21.7-27.5 23.3-58.8Z"
                        fill="#000" /><path
                        d="M237.2 102c-11.5 8.9-21.2 15.5-29.2 19.8-8 4.3-21 10.4-39.1 18.2 20.7 14.3 37 18.1 48.8 11.5 11.7-6.6 18.2-23.1 19.5-49.6Z"
                        fill="#C52621" /></g
                ></g
            ></svg>
    </div>
</div>

<style lang="scss">
    .coin_result_fukidashi {
        user-select: none;
        position: absolute;
        top: -100px;
        left: 50px;
    }

    .coin {
        user-select: none;
        position: absolute;
        width: 70px;
        position: relative;
        cursor: pointer;
    }
    .coin::before {
        content: '';
        display: block;
        padding-top: 142.5%;
    }

    /* カード内の画像 */
    .coin svg {
        width: 100%;
    }
    .coin .back,
    .coin .front {
        transition: all 1s;
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        backface-visibility: hidden;
        animation-fill-mode: forwards;
        --duration: 1s;
        --timing: ease-in-out;
    }
    .coin .back {
        transform: rotateX(-180deg);
    }
    .coin.flip .front {
        transform: rotateX(-180deg);
    }
    .coin.flip .back {
        transform: rotateX(0);
    }
    .coin.openFrontFlip .front {
        animation: parabolicMovement var(--duration) var(--timing),
            frontOpenFrontFlip var(--duration) linear forwards;
    }
    .coin.openFrontFlip .back {
        animation: parabolicMovement var(--duration) var(--timing),
            backOpenFrontFlip var(--duration) linear forwards;
    }
    .coin.openBackFlip .front {
        animation: parabolicMovement var(--duration) var(--timing),
            frontOpenBackFlip var(--duration) linear forwards;
    }
    .coin.openBackFlip .back {
        animation: parabolicMovement var(--duration) var(--timing),
            backOpenBackFlip var(--duration) linear forwards;
    }
    @keyframes frontOpenFrontFlip {
        0% {
            transform: rotateX(0deg);
        }
        100% {
            transform: rotateX(2160deg);
        }
    }
    @keyframes backOpenFrontFlip {
        0% {
            transform: rotateX(-180deg);
        }
        100% {
            transform: rotateX(1980deg);
        }
    }
    @keyframes frontOpenBackFlip {
        0% {
            transform: rotateX(0deg);
        }
        100% {
            transform: rotateX(1980deg);
        }
    }
    @keyframes backOpenBackFlip {
        0% {
            transform: rotateX(-180deg);
        }
        100% {
            transform: rotateX(1800deg);
        }
    }
    @keyframes parabolicMovement {
        0% {
            top: 0;
            transform: rotateZ(0);
        }
        50% {
            top: -120px;
        }
        100% {
            top: 0;
            transform: rotateZ(720deg);
        }
    }
</style>
