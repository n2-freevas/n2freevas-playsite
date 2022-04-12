<script>
    export let width = 100 
    export let font_size = 20
    export let active = false
    export let duration = 2
    export let left_roll_in = false

</script>

<div style='--width:{width}px; --duration:{duration}s; --font_size:{font_size}px'
    class='fukidashi {active ? "active": ""} {left_roll_in? "left_roll_in":""}' 
>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 531 340"><g fill="none" fill-rule="evenodd"><path fill="#000" d="M72 68 278.8.8 531 68l-88 196H219L78 339.1l54-75.1L.6 276.9 59 200.7z"/><path fill="#ffffff" d="M141.4 18.3 507.2 73 394.3 245H59z"/></g></svg>
    <p><slot></slot></p>
</div>
<style lang="scss">
    .fukidashi{
        position: relative;
        width:var(--width);
        opacity:0;
        &.active{
            opacity:1;
        }
        &.left_roll_in{
            transform-origin: 0% 100%;
            animation: leftRollIn var(--duration);
        }
        p{
            position: absolute;
            color:black;
            top:40%;
            left:52%;
            transform: translate(-50%, -50%);
            font-size: var(--font_size);
        }
    }
    @keyframes leftRollIn{
        0%{
            opacity: 0;
		    transform: rotate(-60deg);
        }
        10%{
            opacity:1;
            transform: rotate(0deg);
        }
        90%{
            opacity: 1;
        }
        100%{
            opacity:0;
            transform: rotate(0deg);
        }
    }
</style>
