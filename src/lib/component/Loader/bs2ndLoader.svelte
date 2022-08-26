<script lang="ts">
    export let popindelay: number = 0.15
</script>

<div class="loader">
    <div class="kotodama-box">
        <div class="kotodama">
            <img style="--delay:{`${popindelay}s`};" src="/img/bs2nd/ba_gray.png" alt="ば" />
        </div>
        <div class="kotodama">
            <img style="--delay:{`${popindelay * 2}s`};" src="/img/bs2nd/ku_gray.png" alt="く" />
        </div>
        <div class="kotodama">
            <img style="--delay:{`${popindelay * 3}s`};" src="/img/bs2nd/ze_gray.png" alt="ぜ" />
        </div>
        <div class="kotodama">
            <img style="--delay:{`${popindelay * 4}s`};" src="/img/bs2nd/tsu_gray.png" alt="つ" />
        </div>
        <div class="kotodama">
            <img style="--delay:{`${popindelay * 5}s`};" src="/img/bs2nd/sa_gray.png" alt="さ" />
        </div>
        <div class="kotodama">
            <img style="--delay:{`${popindelay * 6}s`};" src="/img/bs2nd/a_gray.png" alt="あ" />
        </div>
        <div class="kotodama">
            <img style="--delay:{`${popindelay * 7}s`};" src="/img/bs2nd/chi_gray.png" alt="ち" />
        </div>
    </div>
</div>

<style lang="scss">
    .loader {
        width: 100%;
        height: 100%;
        .kotodama-box {
            --size: 30px;
            display: flex;
            flex-direction: row;
            justify-content: center;
            flex-wrap: wrap;
            align-items: center;
            max-width: 150px;
            height: 100%;
            margin: 0 auto;
            .kotodama {
                position: relative;
                width: var(--size);
                height: var(--size);
                margin: 3px;
                img {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: var(--size);
                    height: var(--size);
                    animation: popinkotodama linear 1.3s var(--delay) infinite;
                }
            }

            @keyframes popinkotodama {
                0% {
                    bottom: 0;
                }
                20% {
                    bottom: var(--size);
                }
                40% {
                    bottom: 0;
                    height: var(--size);
                }
                43% {
                    bottom: 0;
                    height: calc(var(--size) / 3);
                }
                46% {
                    bottom: 0;
                    height: var(--size);
                }
            }
        }
    }
</style>
