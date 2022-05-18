<script lang="ts">
    import { boardAreaInfoStore, handAreaInfoStore, deckAreaInfoStore, boardListStore,
             movingStore } from '$lib/store/app/TCGsimStore'
    import type { OnAreaModel } from '$lib/model/app/TCGsimModel'
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
    
    export let id
    export let pos_x:number;
    export let pos_y:number;
    export let pos_z:number = 0;
    let prev_pos_x = pos_x
    let prev_pos_y = pos_y
    export let onArea: OnAreaModel = 'deck'
    export let img_url;
    export let sleeve_url;
    export let rotate = 0
    export let noGuide = false
    let prev_rotate = rotate
    let moving = false;
    let overing = false;
    export let flippin = false;
	
	function onMouseDown() {
        // console.log(`[cardComponent] mouseOver : card_id: ${id} / [${pos_x},${pos_y}] / onArea: ${onArea}`)
		if(!moving){
            moving = true;
            $movingStore = true
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

    function onMouseUp(e) {
        console.log('check')
        if(moving){
            //盤面に突入しているか判定する。
            if(($boardAreaInfoStore.left + 100<e.x && e.x<$boardAreaInfoStore.right)
            && ($boardAreaInfoStore.top < e.y && e.y<$boardAreaInfoStore.bottom)){
                //ボード上の移動でないなら、外部からのボードへの移動であるので、
                //dispatchによって上位要素にイベントを伝搬する。
                if (onArea != 'board'){
                    console.log(`[cardComponent] boardIn: card_id > ${id}`)
                    dispatch('boardIn', {
                        id: id,
                        position: {
                            top: e.x - $boardAreaInfoStore.left,
                            left: e.y - $boardAreaInfoStore.top 
                        },
                        flip: flippin
                    })
                }
                
                //単純に、ボード上の移動であれば、その移動をStoreにも反映する。
                else{
                    console.log(`[cardComponent] boardMove: card_id > ${id}`)
                    $boardListStore = $boardListStore.map(card=>{
                        if(card.id == id){
                            return {...card, x:pos_x, y:pos_y}
                        } else { return card }
                    })
                }
            }
            //手札エリアに突入しているか判定する。
            else if(($handAreaInfoStore.left <e.x && e.x<$handAreaInfoStore.right)
            && ($handAreaInfoStore.top < e.y && e.y<$handAreaInfoStore.bottom)){
                if (onArea != 'hand'){
                    console.log('[cardComponent] handIn: card_id > ', id)
                    dispatch('handIn', {
                        id: id,
                    })
                }
            }
            //デッキエリアに突入しているか判定する。
            else if(($deckAreaInfoStore.left <e.x && e.x<$deckAreaInfoStore.right)
            && ($deckAreaInfoStore.top < e.y && e.y<$deckAreaInfoStore.bottom)){
                
                if (onArea != 'deck'){
                    const height = $deckAreaInfoStore.bottom - $deckAreaInfoStore.top
                    const postPosition = e.y - $deckAreaInfoStore.top
                    const to = postPosition <= height/2 ? 'top':'bottom'
                    console.log('[cardComponent] deckIn: card_id > ', id)
                    dispatch('deckIn', {
                        id: id,
                        post: to
                    })
                }
            }
            // 手札上の移動であれば、その移動を反映する。
            else if(onArea == 'hand'){
                pos_x = prev_pos_x
                pos_y = prev_pos_y
                rotate = prev_rotate
            }
            $movingStore = false;
            moving = false;
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
        rotateSettin()
    }
    function cardRightRotate(){
        rotate += 90
        rotateSettin()
    }
    function rotateSettin(){
        $boardListStore = $boardListStore.map(card=>{
            if(card.id == id){
                return {...card, rotate:rotate}
            } else { return card }
        })
    }
    function cardFlip(){
        flippin = flippin ? false : true
        $boardListStore = $boardListStore.map(card=>{
            if(card.id == id){
                return {...card, flip:flippin}
            } else { return card }
        })
    }
</script>

<svelte:window on:mouseup={onMouseUp} on:mousemove={onMouseMove} />

<section 
    class= 'card-id-{id} card-body {moving? 'movin':''} {noGuide? 'noGuide':''} {onArea!='board'?'noBoard':''}'
    style='--pos_x:{pos_x}px; --pos_y:{pos_y}px; --img:{img_url}; --rotate:{rotate}deg; z-index:{pos_z}'
        on:mouseenter={onMouseOver}
        on:mouseleave={onMouseLeave}
    >

    {#if !$movingStore}
    <div class='card-guide {overing ? 'hover': ''}'>
        {#if overing && !moving}
        <button class='left-rotate' on:click={cardLeftRotate}></button>
        <button class='right-rotate' on:click={cardRightRotate}></button>
        <button class='flip' on:click={cardFlip}></button>
        {/if}
    </div>
    {/if}
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
    z-index: 100;
    left:var(--pos_x);
    top:var(--pos_y);
    width:var(--cw);
    height:var(--ch);
    
    cursor: move;
    &.noBoard{
        transition: 0.2s;
    }
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
        transition: 0.2s;
        .front, .back{
            transition: 0.2s;
            position: absolute;
            left:8px;
            backface-visibility: hidden;
            img{   
                width:calc(var(--cw) - 16px);
                z-index:10000;
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
        --scaleup-width: 80px;
        --scaleup-height: 200px;
        left: calc( -1 * (var(--scaleup-width) / 2));
        top: calc(-1 * var(--scaleup-height));
        width:calc( var(--cw) + var(--scaleup-width));
        height:calc( var(--ch) + var(--scaleup-height));
    }
}

</style>
