<script lang="ts">

    export let onAppear: boolean = false
    export let onChoised: boolean = false
    export let onUnChoised: boolean = false
    let onAppearDriver: boolean = false
    let onChoisedDriver: boolean = false
    let onUnChoisedDriver: boolean = false
    $: {onAppearDriver = onAppear}
    $: {onChoisedDriver = onChoised}
    $: {onUnChoisedDriver = onUnChoised}

</script>

<div class="anime
    {onAppearDriver?"onAppear":""}
    {onChoisedDriver?"onChoised":""}
    {onUnChoisedDriver?"onUnChoised":""}">
    
    <slot></slot>
    <div class='flash {onChoisedDriver?"onChoised":""}'></div>
</div>

<style lang="scss">
    .anime{
        position: absolute;
        top:0;
        // opacity: 1;
        transition: 0.3s;
        transform: translate(-50%, 0);
        &.onAppear{
            animation: appear ease-in-out forwards 0.3s;
            &:hover{top:-20px}    
        }
        &.onChoised{
            &:hover{top:0}
            animation: selected ease-in-out forwards 0.5s;
        }
        &.onUnChoised{
            &:hover{top:0}
            animation: disappear ease-in-out forwards 0.3s;
        }
        .flash{
            position: absolute;
            z-index: -1;
            top:-15%;
            left:-15%;
            width:130%;
            height:130%;
            background: radial-gradient(closest-side, rgba(#ffffff, 1), rgba(#000000, 0));
            opacity:0;
            border-radius: 50%;
            transform-origin: center;
            &.onChoised{
                animation: flash ease-in-out 0.5s
            }
        }
    }
    @keyframes appear{
        0%{opacity: 0; top:50px;}
        100%{opacity: 1; top:0;}
    }
    @keyframes selected{
        0%{transform:translate(-50%, 0) scale(1);}
        100%{transform:translate(-50%, 0) scale(1.5)}
    }
    @keyframes flash{
        0%{opacity:0;transform:scale(1);}
        50%{opacity:1;transform:scale(1.2);}
        100%{opacity:0;transform:scale(1.4);}
    }
    @keyframes disappear{
        0%{opacity:1;transform:translate(-50%, 0) scale(1);}
        100%{opacity:0;transform:translate(-50%, 0) scale(0);}
    }
    
</style>
