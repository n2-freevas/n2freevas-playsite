<script lang="ts">
</script>

<div id="bg_clock">
    <div id="clockbody">
        <!--全体を回す-->
        <img class="time time-1" src="/img/n2_clock/time-1.svg" alt="" />
        <!--各パーツを回す、もしくは、clockbodyの回転に、何もしないことで追従する-->
        <img class="time time-2" src="/img/n2_clock/time-2.svg" alt="" />
        <img class="time time-3" src="/img/n2_clock/time-3.svg" alt="" />
        <img class="time time-4" src="/img/n2_clock/time-4.svg" alt="" />
        <img class="time time-5" src="/img/n2_clock/time-5.svg" alt="" />
        <img class="time time-6" src="/img/n2_clock/time-6.svg" alt="" />
        <img class="time time-7" src="/img/n2_clock/time-7.svg" alt="" />
        <img class="time time-8" src="/img/n2_clock/time-8.svg" alt="" />
        <img class="time time-9" src="/img/n2_clock/time-9.svg" alt="" />
        <img class="time time-10" src="/img/n2_clock/time-10.svg" alt="" />
        <img class="time time-11" src="/img/n2_clock/time-11.svg" alt="" />
        <img class="time time-12" src="/img/n2_clock/time-12.svg" alt="" />
        <img id="insidewheel" src="/img/n2_clock/clock_insidewheel.svg" alt="" />
        <img src="/img/n2_clock/clock_body.svg" alt="" />
    </div>
</div>

<style lang="scss">
    #bg_clock {
        position: absolute;
        overflow: hidden;
        height: 100%;
        width: 100%;
        top: 0;
        left: 0;
        z-index: -1;
    }
    #bg_clock #clockbody {
        position: absolute;
        top: 40vh;
        left: 25vw;
        width: 120vw;
        height: 120vw;
        -webkit-animation: clockrotate 60s cubic-bezier(1, 0, 0.95, 0.38) infinite;
        animation: clockrotate 60s cubic-bezier(1, 0, 0.95, 0.38) infinite;
        transition: 1s;
    }
    // #bg_clock #clockbody.showmove {
    //     top: -50px;
    //     left: -10vw;
    // }
    // #bg_clock #clockbody.slideleft {
    //     -webkit-animation: clockslide ease-out 4s;
    //     animation: clockslide ease-out 4s;
    // }

    @keyframes clockslide {
        0% {
            left: 25vw;
            transform: rotate(0deg);
        }
        100% {
            left: -200%;
            transform: rotate(-270deg);
        }
    }
    @-webkit-keyframes clockslide {
        0% {
            left: 25vw;
            -webkit-transform: rotate(0deg);
        }
        100% {
            left: -200%;
            -webkit-transform: rotate(-270deg);
        }
    }

    #bg_clock #clockbody img {
        width: 100%;
    }
    @keyframes clockrotate {
        0% {
            transform: rotate(0deg);
        }
        2% {
            transform: rotate(7deg);
        }
        4% {
            transform: rotate(14deg);
        }
        6% {
            transform: rotate(21deg);
        }
        8% {
            transform: rotate(28deg);
        }
        10% {
            transform: rotate(36deg);
        }
        12% {
            transform: rotate(43deg);
        }
        14% {
            transform: rotate(50deg);
        }
        16% {
            transform: rotate(57deg);
        }
        18% {
            transform: rotate(64deg);
        }
        20% {
            transform: rotate(72deg);
        }
        22% {
            transform: rotate(79deg);
        }
        24% {
            transform: rotate(86deg);
        }
        26% {
            transform: rotate(93deg);
        }
        28% {
            transform: rotate(100deg);
        }
        30% {
            transform: rotate(108deg);
        }
        32% {
            transform: rotate(115deg);
        }
        34% {
            transform: rotate(122deg);
        }
        36% {
            transform: rotate(129deg);
        }
        38% {
            transform: rotate(136deg);
        }
        40% {
            transform: rotate(144deg);
        }
        42% {
            transform: rotate(151deg);
        }
        44% {
            transform: rotate(158deg);
        }
        46% {
            transform: rotate(165deg);
        }
        48% {
            transform: rotate(172deg);
        }
        50% {
            transform: rotate(180deg);
        }
        52% {
            transform: rotate(187deg);
        }
        54% {
            transform: rotate(194deg);
        }
        56% {
            transform: rotate(201deg);
        }
        58% {
            transform: rotate(208deg);
        }
        60% {
            transform: rotate(216deg);
        }
        62% {
            transform: rotate(223deg);
        }
        64% {
            transform: rotate(230deg);
        }
        66% {
            transform: rotate(237deg);
        }
        68% {
            transform: rotate(244deg);
        }
        70% {
            transform: rotate(252deg);
        }
        72% {
            transform: rotate(259deg);
        }
        74% {
            transform: rotate(266deg);
        }
        76% {
            transform: rotate(273deg);
        }
        78% {
            transform: rotate(280deg);
        }
        80% {
            transform: rotate(288deg);
        }
        82% {
            transform: rotate(295deg);
        }
        84% {
            transform: rotate(302deg);
        }
        86% {
            transform: rotate(309deg);
        }
        88% {
            transform: rotate(316deg);
        }
        90% {
            transform: rotate(324deg);
        }
        92% {
            transform: rotate(331deg);
        }
        94% {
            transform: rotate(338deg);
        }
        96% {
            transform: rotate(345deg);
        }
        98% {
            transform: rotate(352deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
    @-webkit-keyframes clockrotate {
        0% {
            -webkit-transform: rotate(0deg);
        }
        2% {
            -webkit-transform: rotate(7deg);
        }
        4% {
            -webkit-transform: rotate(14deg);
        }
        6% {
            -webkit-transform: rotate(21deg);
        }
        8% {
            -webkit-transform: rotate(28deg);
        }
        10% {
            -webkit-transform: rotate(36deg);
        }
        12% {
            -webkit-transform: rotate(43deg);
        }
        14% {
            -webkit-transform: rotate(50deg);
        }
        16% {
            -webkit-transform: rotate(57deg);
        }
        18% {
            -webkit-transform: rotate(64deg);
        }
        20% {
            -webkit-transform: rotate(72deg);
        }
        22% {
            -webkit-transform: rotate(79deg);
        }
        24% {
            -webkit-transform: rotate(86deg);
        }
        26% {
            -webkit-transform: rotate(93deg);
        }
        28% {
            -webkit-transform: rotate(100deg);
        }
        30% {
            -webkit-transform: rotate(108deg);
        }
        32% {
            -webkit-transform: rotate(115deg);
        }
        34% {
            -webkit-transform: rotate(122deg);
        }
        36% {
            -webkit-transform: rotate(129deg);
        }
        38% {
            -webkit-transform: rotate(136deg);
        }
        40% {
            -webkit-transform: rotate(144deg);
        }
        42% {
            -webkit-transform: rotate(151deg);
        }
        44% {
            -webkit-transform: rotate(158deg);
        }
        46% {
            -webkit-transform: rotate(165deg);
        }
        48% {
            -webkit-transform: rotate(172deg);
        }
        50% {
            -webkit-transform: rotate(180deg);
        }
        52% {
            -webkit-transform: rotate(187deg);
        }
        54% {
            -webkit-transform: rotate(194deg);
        }
        56% {
            -webkit-transform: rotate(201deg);
        }
        58% {
            -webkit-transform: rotate(208deg);
        }
        60% {
            -webkit-transform: rotate(216deg);
        }
        62% {
            -webkit-transform: rotate(223deg);
        }
        64% {
            -webkit-transform: rotate(230deg);
        }
        66% {
            -webkit-transform: rotate(237deg);
        }
        68% {
            -webkit-transform: rotate(244deg);
        }
        70% {
            -webkit-transform: rotate(252deg);
        }
        72% {
            -webkit-transform: rotate(259deg);
        }
        74% {
            -webkit-transform: rotate(266deg);
        }
        76% {
            -webkit-transform: rotate(273deg);
        }
        78% {
            -webkit-transform: rotate(280deg);
        }
        80% {
            -webkit-transform: rotate(288deg);
        }
        82% {
            -webkit-transform: rotate(295deg);
        }
        84% {
            -webkit-transform: rotate(302deg);
        }
        86% {
            -webkit-transform: rotate(309deg);
        }
        88% {
            -webkit-transform: rotate(316deg);
        }
        90% {
            -webkit-transform: rotate(324deg);
        }
        92% {
            -webkit-transform: rotate(331deg);
        }
        94% {
            -webkit-transform: rotate(338deg);
        }
        96% {
            -webkit-transform: rotate(345deg);
        }
        98% {
            -webkit-transform: rotate(352deg);
        }
        100% {
            -webkit-transform: rotate(360deg);
        }
    }
    @keyframes clockspin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(720deg);
        }
    }
    @-webkit-keyframes clockspin {
        0% {
            -webkit-transform: rotate(0deg);
        }
        100% {
            -webkit-transform: rotate(720deg);
        }
    }

    #bg_clock #clockbody img.time {
        position: absolute;
        width: 10%;
        animation: wheelrotate 10s linear infinite;
        -webkit-animation: wheelrotate 10s linear infinite;
    }

    #bg_clock #clockbody img#insidewheel {
        position: absolute;
        width: 25%;
        animation: wheelrotate 10s linear infinite reverse;
        -webkit-animation: wheelrotate 10s linear infinite reverse;
        top: 37.5%;
        left: 37.5%;
    }
    // #bg_clock #clockbody.spin,
    // #bg_clock #clockbody img.time.spin,
    // #bg_clock #clockbody img#insidewheel.spin {
    //     -webkit-animation: clockspin 1s;
    //     animation: clockspin 1s;
    // }
    .time-3 {
        top: 45%;
        left: 63.5%;
    }
    .time-2 {
        top: 35.75%;
        left: 61.021%;
    }
    .time-1 {
        top: 28.979%;
        left: 54.25%;
    }
    .time-12 {
        top: 26.5%;
        left: 45%;
    }
    .time-11 {
        top: 28.979%;
        left: 35.75%;
    }
    .time-10 {
        top: 35.75%;
        left: 28.979%;
    }
    .time-9 {
        top: 45%;
        left: 26.5%;
    }
    .time-8 {
        top: 54.25%;
        left: 28.979%;
    }
    .time-7 {
        top: 61.021%;
        left: 35.75%;
    }
    .time-6 {
        top: 63.5%;
        left: 45%;
    }
    .time-5 {
        top: 61.021%;
        left: 54.25%;
    }
    .time-4 {
        top: 54.25%;
        left: 61.021%;
    }
    #bg_clock #clockbody img.time-2,
    #bg_clock #clockbody img.time-4,
    #bg_clock #clockbody img.time-6,
    #bg_clock #clockbody img.time-8,
    #bg_clock #clockbody img.time-10,
    #bg_clock #clockbody img.time-12 {
        animation-direction: reverse;
        -webkit-animation-direction: reverse;
    }

    @keyframes wheelrotate {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
    @-webkit-keyframes wheelrotate {
        0% {
            -webkit-transform: rotate(0deg);
        }
        100% {
            -webkit-transform: rotate(360deg);
        }
    }

    @media screen and (min-width: 600px) {
        // #menu_box {
        //     margin-left: calc((100vw - 500px) / 2);
        //     margin-right: calc((100vw - 500px) / 2);
        // }
    }
    @media screen and (min-width: 700px) {
        // .box {
        //     margin-left: calc((100vw - 600px) / 2);
        //     margin-right: calc((100vw - 600px) / 2);
        // }

        #bg_clock #clockbody {
            top: 35vh;
            left: 50vw;
            height: 850px;
            width: 850px;
        }

        #bg_clock #clockbody img {
            width: 850px;
        }

        // #bg_clock img.insidewheel {
        //     width: 212.5px;
        // }
        #bg_clock img.time {
            width: 85px;
        }
    }
</style>
