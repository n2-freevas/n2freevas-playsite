<script lang="ts">
    import ToastArea from '$lib/component/toast/ToastArea.svelte'
    import { modeStore } from '$lib/store/app/TCGsimStore'
</script>


<header>
    <div class='n2-logo'>
        <a href='/'>
            <img src='/img/n2-icon-white.svg' alt=''>
        </a>
    </div>
    <div class='color-config'>
        <button class='light' on:click={()=>{$modeStore = 'light'}}></button>
        <button class='dark' on:click={()=>{$modeStore = 'dark'}}></button>
    </div>
</header>
<div id='tcg-all-compnents'>
    <article id='screen'>
        <section id='base' class={$modeStore}>
            <slot></slot>
        </section>
    </article>
    
    <footer class={$modeStore}>
        <a href='/app/tcg-simulator/game'>
            <div></div>
        </a>
        <a href='/app/tcg-simulator/edit'>
            <div></div>
        </a>
    </footer>
</div>
<ToastArea/>

<style lang="scss">
    :root{
        --header-height: 40px;
        --cw:90px;
        --ch:110px;
    }
    #tcg-all-compnents{
        display: flex;
        justify-content: space-between;
        top:0;
        left:0;
        right:0;
        bottom:0;
        overflow-y: scroll;
        -ms-overflow-style: none;    /* IE, Edge 対応 */
        scrollbar-width: none;       /* Firefox 対応 */
        &::-webkit-scrollbar {  /* Chrome, Safari 対応 */
            display:none;
        }
    }
    header{
        display: flex;
        justify-content: space-between;
        height:var(--header-height);
        
        .n2-logo{
            padding:10px;
            img{
                height:20px;
            }
        }
        .color-config{
            margin:0 20px 0 0;
            display: flex;
            align-items: center;
            button{
                width:25px;
                height:25px;
                margin:0 7px;
                border-radius: 7px;
            }
            .light{
                background: white;
            }
            .dark{
                background: darkblue;
            }
        }
    }
    #screen{
        display:flex;
        flex-direction: column;
        justify-content: center;
        width:calc(100vw - 70px);
        height:calc(100vh - 40px);
        #base{
            width: 1100px;
            height:760px;
            margin:0 auto;
            -moz-perspective:500;
            -webkit-perspective:500;
            -o-perspective:500;
            -ms-perspective:500;
            perspective: 500;
            // overflow: hidden;
            &.light{
                background: rgb(255,255,255);
                background: radial-gradient(circle at bottom, rgba(255,255,255,1) 0%, rgba(255,236,192,1) 100%);
            }
            &.dark{
                background: rgb(36,24,110);
                background: radial-gradient(circle at bottom, rgba(36,24,110,1) 0%, rgba(0,0,0,1) 100%);
            }
        }
    }
    
    footer{
        top:0;bottom:0;
        right:0;
        width:70px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        &.light{
            background: white;
        }
        &.dark{
            background: black;
        }
        a{
            div{
                width:50px;
                height:50px;
                background: yellow;
            }
        }
    }
</style>
