<script lang="ts">
    import type { DamageKan } from '$lib/model/app/PokemonCardGameEffectorStore'
    import { createEventDispatcher } from 'svelte';
    
    export let model: DamageKan = {
        id: 1,
        x:0,
        y:0,
        counter: 100
    }
    let size = 100
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
                model.counter += 50
            }
            else{
                model.counter += 10
            }
        }
        
    }

    function rightClickHandler(event){
        if(model.counter > 0){
            if (!moved_flag){
                if(event.layerY < (size / 2)){
                model.counter -= 50
                }
                else{
                    model.counter -= 10
                }
            }
        }
    }
</script>

<svelte:window on:mouseup|stopPropagation={mouseUpHandler} on:mousemove|stopPropagation={mouseMoveHandler}/>

<div class='damage_kan' style="--id:{model.id};--x:{model.x}px; --y:{model.y}px; --size:{size}px"
 on:mousedown|stopPropagation={mouseDownHandler}
 on:click={clickHandler}
 on:contextmenu|preventDefault={rightClickHandler}
>
    <p>{model.counter}</p>
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
        background: yellow;
        p{
            user-select: none;
            color:black;
            font-size: 20px;
            font-weight: bold;
        }
        
    }
</style>
