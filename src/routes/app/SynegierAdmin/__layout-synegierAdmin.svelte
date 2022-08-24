<script lang="ts">
    import { goto } from "$app/navigation";
    import ToastArea from '$lib/component/toast/ToastArea.svelte'
</script>

<article id="synegierAdminLayout">
    <header>
        <div class='title'>
            <img src='/img/synegierAdmin/logo_illust.png' alt="">
            synegier<br>admin
        </div>
        <div class="pagelinks">
            <div on:click={()=>{goto('/app/SynegierAdmin/simulator')}}>Simulator</div>
            <div on:click={()=>{goto('/app/SynegierAdmin/data')}}>Data</div>
            <div on:click={()=>{goto('/app/SynegierAdmin/document')}}>Document</div>
        </div>
    </header>
    <div id="slot">
        <slot></slot>
    </div>
</article>
<ToastArea></ToastArea>

<style lang="scss">
    #synegierAdminLayout{
        // width:100vw;
        // overflow: hidden;
        font-family: 'Press Start 2P', cursive;
    }
    header{
        z-index: 1;
        position: fixed;
        display: flex;
        justify-content: space-between;
        align-items: center;
        top:20px;
        left:5vw;
        width:90vw;
        min-width: 300px;
        overflow:hidden;
        height:60px;
        background: black;
        border-radius: 10px;
        background: rgba($color: #222222, $alpha: 0.9);
        div{
            padding:0 20px;
            cursor: pointer;
        }
        .title{
            display: flex;
            align-items: center;
            margin-right: 200px;
            img{
                width:45px;
                margin:0 20px;
                filter: grayscale(0.4);
            }
        }
        .pagelinks{
            display: flex;
        }
    }
    #slot{
        z-index: 0;
        padding-top: 100px;
    }
</style>
