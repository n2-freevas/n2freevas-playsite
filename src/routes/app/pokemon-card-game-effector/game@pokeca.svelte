<script lang="ts">
    import { onMount } from 'svelte'
    import StorageComponent from '$lib/component/PokecaEffector/StorageComponent.svelte'
    import CoinComponent from '$lib/component/PokecaEffector/CoinComponent.svelte'
    import EmotionConponent from '$lib/component/PokecaEffector/EmotionConponent.svelte'

    onMount(() => {
        const video = document.getElementById('web-video')
        navigator.mediaDevices
            .getUserMedia({
                video: true,
                audio: false
            })
            .then((stream) => {
                //@ts-ignore
                video.srcObject = stream
                //@ts-ignore
                video.play()
            })
            .catch((e) => {
                console.log(e)
            })
    })
</script>

<section id="video-layor">
    <video id="web-video">
        <track kind="captions" />
    </video>
</section>

<section id="effect-layor">
    <StorageComponent />
</section>
<!-- <section id='emotion-layor'>
    <EmotionConponent></EmotionConponent>
</section> -->
<section id="coin-layor">
    <CoinComponent />
</section>

<style lang="scss">
    section {
        position: absolute;
        width: 100vw;
        height: 100vh;
    }
    #video-layor {
        display: flex;
        justify-content: center;
        overflow: hidden;
        video {
            position: absolute;
            top: 0;
            bottom: 0;
            height: 98%;
            margin: auto 0;
        }
    }
    #effect-layor {
        right: 0;
        width: 0px;
        height: 100vh;
    }
    #coin-layor {
        position: fixed;
        width: 0;
        height: 0;
        bottom: 120px;
        left: 40px;
    }
</style>
