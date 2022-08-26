<script>
    import MediaQuery from 'svelte-media-query'
</script>

<svelte:head>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" />
    <link
        href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
        rel="stylesheet" />
</svelte:head>
<svelte:window on:contextmenu|preventDefault />
<div class="info">
    <div class="n2-logo">
        <a href="/"><img src="/img/n2-icon-white.svg" alt="" /></a>
        <h1>Pokemon Card Game<br />Web Damage Counter</h1>
    </div>
</div>

<article id="web-damekan-body">
    <MediaQuery query="(min-width: 701px)" let:matches>
        {#if matches}
            <slot />
        {/if}
    </MediaQuery>
    <MediaQuery query="(max-width: 700px)" let:matches>
        {#if matches}
            <p>このアプリは、<br />スマホサイズではお楽しみいただけません。</p>
        {/if}
    </MediaQuery>
</article>

<style lang="scss">
    p {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 90vw;
    }
    .info {
        position: fixed;
        width: 60%;
        max-width: 400px;
        right: 20px;
        padding: 20px;
        z-index: 100;
        .n2-logo {
            display: flex;
            background: linear-gradient(135deg, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.2));
            padding: 25px;
            img {
                width: 30px;
            }
            h1 {
                font-size: 12px;
                margin: 0 20px;
            }
        }
    }
    article {
        position: relative;
        background: #222222;
        height: 100vh;
        overflow: hidden;
        font-family: 'Press Start 2P', cursive;
    }
</style>
