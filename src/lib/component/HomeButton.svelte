<script lang="ts">
    import type { MainMenu } from '$lib/model/Menu'
    export let model: MainMenu
    export let size: number = 100
    let isFocus = false

    function focusInteractionON() {
        isFocus = true
    }
    function focusInteractionOFF() {
        isFocus = false
    }
</script>

<div
    class="homebutton-box {isFocus && model.active ? 'focus' : ''} {model.active ? '' : 'disactive'}"
    style="width:{size}px; height:{size}px; --topval: {size / 10}px;">
    <a href={model.active ? model.path : ''}>
        <div class="homebutton_background {isFocus && model.active ? 'focus' : ''}" />
        <div class="icons">
            <img src={model.img} alt="{model.explain}ボタン" />
            <h1>{model.name}</h1>
        </div>
        <div class="hover_area" on:mouseenter={focusInteractionON} on:mouseleave={focusInteractionOFF} />
    </a>
    {#if !model.active}
        <p>comming soon</p>
    {/if}
</div>

<style lang="scss">
    .homebutton-box {
        position: relative;
        background: white;
        border-radius: 15px;
        margin: 15px;
        transition: 0.5s;
        &.focus {
            border-radius: 0px;
        }
        &.disactive {
            background: rgba(255, 255, 255, 0.3);
            img,
            h1 {
                opacity: 0.3;
            }
        }
        .icons {
            position: absolute;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            top: var(--topval);
            left: var(--topval);
            width: calc(100% - (var(--topval) * 2));
            height: calc(100% - (var(--topval) * 2));

            img {
                height: 60%;
                margin: 0 auto;
            }
            h1 {
                text-align: center;
                font-size: 14px;
                color: white;
            }
        }

        .homebutton_background {
            position: absolute;
            --positioning: 5px;
            top: var(--positioning);
            left: var(--positioning);
            width: calc(100% - (var(--positioning) * 2));
            height: calc(100% - (var(--positioning) * 2));
            background: black;
            border-radius: 25px;
            transition: 0.5s;
            &.focus {
                transform: rotate(45deg);
                background: red;
                border-radius: 0px;
            }
        }
        .hover_area {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }
        p {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-weight: bold;
            opacity: 1;
            width: 120px;
            z-index: 0;
            color: white;
        }
    }
</style>
