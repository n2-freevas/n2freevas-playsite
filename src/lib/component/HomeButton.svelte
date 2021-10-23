<script lang="ts">
    export let path :string
    export let icon_url :string
    export let explain :string

    let isFocus = false;
    function focusInteractionON(){isFocus = true}
    function focusInteractionOFF(){isFocus = false}
</script>

<div class='homebutton-box {isFocus? 'focus' : ''}'>
    <a href={path}>

        <div class='homebutton_background {isFocus? 'focus' : ''}'></div>
        <div class='icons'>
            <img src={icon_url} alt='{explain}ボタン'>
            <h1>{explain}</h1>
        </div>
        <div class='hover_area' on:mouseenter={focusInteractionON} on:mouseleave={focusInteractionOFF}></div>
    </a>
    
</div>

<style lang="scss">
    .homebutton-box{
        position: relative;
        width:100px;
        height:100px;
        background: white;
        border-radius: 15px;
        margin:15px;
        transition: 0.5s;
        &.focus{
            
            border-radius: 0px;
        }
        .icons{
            position: absolute;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            --topval: 10px;
            top:var(--topval);left:var(--topval);
            width:calc(100% - (var(--topval) * 2 ));
            height:calc(100% - (var(--topval) * 2 ));
            
            img{
            height:60%;
            margin:0 auto;
            }
            h1{
                text-align: center;
                font-size: 14px;
                color: white;
            }
        }
        
        .homebutton_background{
            position: absolute;
            --positioning: 5px;
            top:var(--positioning);left:var(--positioning);
            width: calc(100% - ( var(--positioning) * 2 ));
            height: calc(100% - ( var(--positioning) * 2 ));
            background: black;
            border-radius: 25px;
            transition: 0.5s;
            &.focus{
                transform: rotate(45deg);
                background: red;
                border-radius: 0px;
            }
        }
        .hover_area{
            position: absolute;
            top:0;left:0;
            width:100%;height:100%;
        }
    }

</style>