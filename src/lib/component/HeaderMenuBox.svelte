<script lang="ts">
    export let name :string
    export let path :string
    export let img : string
    export let explain: string
    let isOpen :boolean = false

    function focusInteractionON(){isOpen = true}
    function focusInteractionOFF(){isOpen = false}
</script>

<div class='menu-box'>
    <div class='menu-name' on:mouseenter={focusInteractionON} on:mouseleave={focusInteractionOFF}>
        <a href={path}><p>{name}</p></a>
    </div>
    <div class='explain-box {isOpen? 'open' : ''}'>
        <img src={img} alt="">
        <p>{@html explain}</p>
    </div>
</div>

<style lang="scss">
    .menu-box{
        position: relative;
        display: inline-block;
        .menu-name{
            border-radius: 20px;
            padding:5px 20px;
            &:hover{
                background: white;
                p{color:black}
            }
        }
        .explain-box{
            z-index: 100;
            position: absolute;
            margin-top:30px;
            right:0;
            opacity: 0;
            background: linear-gradient(90deg, rgba(20,20,20,1),rgba(20,20,20,0.5));
            padding:20px;
            display: flex;
            flex-direction: row;
            align-items: center;
            transition: .2s;
            &.open{
                opacity: 1;
            }
            img{width:50px;}
            p{padding:20px;width:300px; color:white}

        }
    }
</style>
