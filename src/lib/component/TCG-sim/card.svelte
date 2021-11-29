<script lang="ts">
    import { boardAreaInfoStore, handAreaInfoStore, deckAreaInfoStore,
            } from '$lib/store/app/TCGsimStore'
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
    
    export let id
    export let pos_x;
    export let pos_y;
    let prev_pos_x = pos_x
    let prev_pos_y = pos_y
    export let onArea = 'board'
    export let img_url;
    export let sleeve_url;
    export let rotate = 0
    export let noGuide = false
    let prev_rotate = rotate
    let moving = false;
    let overing = false;
    export let flippin = false;
    
	
	function onMouseDown() {
        console.log(id)
		if(!moving){
            moving = true;
            if(onArea != 'board'){
                rotate = 0
            }
        }
	}
	
	function onMouseMove(e: MouseEvent) {
		if (moving) {
			pos_x += e.movementX;
			pos_y += e.movementY;
		}
	}

    function onMouseUp(e: MouseEvent) {
        if(moving){
            moving = false;
            if(($boardAreaInfoStore.left + 200<e.x && e.x<$boardAreaInfoStore.right-200)
            && ($boardAreaInfoStore.top < e.y && e.y<$boardAreaInfoStore.bottom)){
                dispatch('boardIn', {
                    id: id,
                    position: {
                        top: e.x - $boardAreaInfoStore.left,
                        left: e.y - $boardAreaInfoStore.top 
                    }
                })
            }
            else if(($handAreaInfoStore.left <e.x && e.x<$handAreaInfoStore.right)
            && ($handAreaInfoStore.top < e.y && e.y<$handAreaInfoStore.bottom)){
                dispatch('handIn', {
                    id: id,
                })
            }
            else if(($deckAreaInfoStore.left <e.x && e.x<$deckAreaInfoStore.right)
            && ($deckAreaInfoStore.top < e.y && e.y<$deckAreaInfoStore.bottom)){
                const height = $deckAreaInfoStore.bottom - $deckAreaInfoStore.top
                const postPosition = e.y - $deckAreaInfoStore.top
                const to = postPosition <= height/2 ? 'top':'bottom'
                dispatch('deckIn', {
                    id: id,
                    post: to
                })
            }
            else if(onArea != 'board'){
                console.log('check')
                pos_x = prev_pos_x
                pos_y = prev_pos_y
                rotate = prev_rotate
            }
            else if(onArea == 'board'){
                dispatch('boardCardMove', {
                    id: id,
                    x: pos_x,
                    y: pos_y,
                    rotate: rotate,
                    flip: flippin
                })
            }
            
        }
	}
    function onMouseOver(){
        overing = true;
    }
    function onMouseLeave(){
        overing = false;
    }
    function cardLeftRotate(){
        rotate -= 90
    }
    function cardRightRotate(){
        rotate += 90
    }
    function cardFlip(){
        flippin = flippin ? false : true
    }
</script>
<!-- <svelte:window on:mouseup={onMouseUp} on:mousemove={onMouseMove} /> -->


<section 
    class= 'card-body {moving? 'movin':''} {noGuide? 'noGuide':''}' style='--pos_x:{pos_x}px;
            --pos_y:{pos_y}px;--img:{img_url};
            --rotate:{rotate}deg;'
    on:mouseenter={onMouseOver}
    on:mouseleave={onMouseLeave}
    >

    <!-- {#if !noGuide} -->
    <div class='card-guide {overing ? 'hover': ''}'>
        {#if overing && !moving}
        <button class='left-rotate' on:click={cardLeftRotate}></button>
        <button class='right-rotate' on:click={cardRightRotate}></button>
        <button class='flip' on:click={cardFlip}></button>
        {/if}
    </div>
    <!-- {/if} -->
    <div class='card-surface {flippin? 'flippin':''}' on:mousedown={onMouseDown}>
        <div class='front'>
            <img src={img_url} alt=''>
        </div>
        <div class='back'>
            <img src={sleeve_url} alt=''>
        </div>
    </div>

    {#if moving && !noGuide}
        <section class='card-shadow' style='--pos_x:{pos_x}px;--pos_y:{pos_y}px;--img:{img_url}'>
            {#if flippin}
            <img src={sleeve_url} alt=''>
            {:else}
                <img src={img_url} alt=''>
            {/if}
            
        </section>
    {/if}
    
</section>


<style lang="scss">
:root{
    --guide-color:#ffbb00;
}
img{
    -webkit-user-drag: none;
    border-radius: 5px;
}
.card-body{
    position: absolute;
    left:var(--pos_x);
    top:var(--pos_y);
    width:var(--cw);
    height:var(--ch);
    transition: 0.2s;
    cursor: move;
    &.movin{
        transition: none;
        .card-surface{
            filter:grayscale(100%) blur(2px);
        } 
    }
    &.noGuide{
        .card-surface{
            filter: none;
        }
    }
    .card-surface{
        position: absolute;
        transform: rotate(var(--rotate));
        transition: 0.2s;
        width:100%;height:100%;
        -moz-perspective:500;
        -webkit-perspective:500;
        -o-perspective:500;
        -ms-perspective:500;
        perspective: 500;
        .front, .back{
            transition: 0.2s;
            position: absolute;
            left:8px;
            backface-visibility: hidden;
            img{   
                width:calc(var(--cw) - 16px);
            }
        }
        .back{
            transform:rotateY(-180deg);
        }
        &.flippin{
            .front{
                transform: rotateY(-180deg);
            }
            .back{
                transform: rotateY(0deg);
            }
        }
    }
    .card-guide{
        position: absolute;
        --scaleup-width: 10px;
        --scaleup-height: 50px;
        left: calc( -1 * (var(--scaleup-width) / 2));
        top: calc(-1 * (var(--scaleup-height) / 2));
        width:calc( var(--cw) + var(--scaleup-width));
        height:calc( var(--ch) + var(--scaleup-height));
        border-radius: 10px;

        &.hover{
            border: solid 2px var(--guide-color);
            button{
                opacity: 0.6;
                padding:0;
                position: absolute;
                --b-width:50%;
                --b-height:25px;
                --b-width-long: 60px;
                --b-height-long: 70px;
                --b-bradius: 8px;
                width:var(--b-width);height:var(--b-height);
                background-color: var(--guide-color);
                
                &.left-rotate{
                    top:0;
                    left:0;
                }
                &.right-rotate{
                    top:0;
                    right:0;
                }
                &.flip{
                    bottom:0;
                    left:0;
                    right:0;
                    width:100%;
                    height:var(--b-height);
                }
            }
            
        }
    }
    .card-shadow{
        position: absolute;
        --scaleup-width: 20px;
        --scaleup-height: 50px;
        left: calc( -1 * (var(--scaleup-width) / 2));
        top: calc(-1 * var(--scaleup-height) * 2);
        width:calc( var(--cw) + var(--scaleup-width));
        height:calc( var(--ch) + var(--scaleup-height));
    }
}

</style>
