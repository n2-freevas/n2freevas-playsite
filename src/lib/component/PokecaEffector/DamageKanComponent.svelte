<script lang="ts">
    import type { DamageKan } from '$lib/model/app/PokemonCardGameEffectorStore'
    import { createEventDispatcher } from 'svelte';
    
    export let model: DamageKan = {
        id: 1,
        x:0,
        y:0,
        counter: 0
    }
    const init_size = 100
    const init_font_size = 40
    const init_color = [255, 200 ,0]
    let size = init_size
    let font_size = init_font_size
    let color = init_color
    
    let moving: boolean = false
    let moved_flag = false
    
    function mouseDownHandler(){
        if(!moving){
            moving = true
            moved_flag = false
        }
    }
    function mouseMoveHandler(event: MouseEvent){
        if (moving){
            moved_flag = true
            model.x += event.movementY
            model.y += event.movementX
        }
    }
    function mouseUpHandler(){
        if (moving){
            moving = false
        }
    }
    function clickHandler(event){
        if (!moved_flag){
            if(event.layerY < (size / 2)){
                if(model.counter <= 450){
                    model.counter += 50
                }
                else{
                    model.counter = 500
                }
            }
            else{
                if(model.counter >= 50){
                    model.counter -= 50
                }
                else{
                    model.counter = 0
                }
            }
            //calcDamageReaction()
        }   
    }
    function rightClickHandler(event){
        if (!moved_flag){
            if(event.layerY < (size / 2)){
                if(model.counter <= 490){
                    model.counter += 10
                }
            }
            else{
                if(model.counter >= 10){
                    model.counter -= 10
                }
            }
            //calcDamageReaction()
        }
    }
    $:{
        size = 100 + (model.counter/10)
        font_size = 40 + (model.counter/20)
        color[1] = 200 - (model.counter/2)
        console.log(color)
    }
</script>

<svelte:window on:mouseup|stopPropagation={mouseUpHandler} on:mousemove|stopPropagation={mouseMoveHandler}/>

<div class='damage_kan' style="--id:{model.id};--x:{model.x}px; --y:{model.y}px; --size:{size}px"
 on:mousedown|stopPropagation={mouseDownHandler}
 on:click={clickHandler}
 on:contextmenu|preventDefault={rightClickHandler}
>
    <img src='/img/pokeca/icon_white.svg' alt=''>
    <div class='damege_kan_mask' style='--color:rgb({color[0]},{color[1]},{color[2]})'></div>
    <p style='--font_size:{font_size}px'>{model.counter}</p>
</div>

<style lang="scss">
    .damage_kan{
        position: absolute;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: var(--id);
        top:var(--x);
        left:var(--y);
        width:var(--size);
        height:var(--size);
        border-radius: calc( var(--size) / 2 );
        background: linear-gradient(45deg, rgba(0,0,0,1), rgba(0,0,0,0.4));
        overflow: hidden;
        img{
            z-index: 1;
            position: absolute;
            width:100%;
        }
        .damege_kan_mask{
            z-index: 2;
            position: absolute;
            width:100%;
            height:100%;
            background-color:var(--color);
            opacity: 0.8;
        }
        p{
            z-index: 3;
            user-select: none;
            color:black;
            font-size: var(--font_size);
            font-weight: bold;
        }
        
    }
</style>
