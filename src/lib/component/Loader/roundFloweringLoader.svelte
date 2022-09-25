<script lang="ts">
    export let color: string = 'white'
    export let is_animate: boolean = true

    export let numof_small_round: number = 7
    export let numof_large_round: number = 5
    export let small_round_size: number = 80
    export let large_round_size: number = 120
    export let small_petal_stroke: number = 30
    export let large_petal_stroke: number = 50
    export let small_stroke_delay: number = 0
    export let large_stroke_delay: number = 0.4
    export let small_round_spin_speed: string = '5s'
    export let large_round_spin_speed: string = '2s'

    interface SmallFloweringArgs {
        flower_petal_x: string
        flower_petal_y: string
    }
    interface LargeFloweringArgs {
        flower_petal_x: string
        flower_petal_y: string
    }
    let small_flowering_args: SmallFloweringArgs[] = []
    let large_flowering_args: LargeFloweringArgs[] = []

    for (let i = 0; i < numof_small_round; i++) {
        let radius = ((2 * Math.PI) / numof_small_round) * i
        small_flowering_args.push({
            flower_petal_x: `${Math.sin(radius) * small_petal_stroke}px`,
            flower_petal_y: `${Math.cos(radius) * small_petal_stroke}px`
        })
    }
    for (let i = 0; i < numof_large_round; i++) {
        let radius = ((2 * Math.PI) / numof_large_round) * i
        large_flowering_args.push({
            flower_petal_x: `${Math.sin(radius) * large_petal_stroke}px`,
            flower_petal_y: `${Math.cos(radius) * large_petal_stroke}px`
        })
    }
</script>

<div class="loader" style="--loader_height:{`${large_petal_stroke * 2 + large_round_size}px`}; --color:{color};">
    <div class="fulcrum">
        <div class="petals {is_animate ? 'animate' : ''}" style="--size:{`${small_round_size}px`}; --speed:{small_round_spin_speed}">
            {#each small_flowering_args as arg}
                <div
                    class="petal {is_animate ? 'animate' : ''}"
                    style="--size:{`${small_round_size}px`}; --move_x:{arg.flower_petal_x}; --move_y:{arg.flower_petal_y}; --delay:{`${small_stroke_delay}s`}" />
            {/each}
        </div>
        <div class="petals {is_animate ? 'animate' : ''}" style="--size:{`${large_round_size}px`}; --speed:{large_round_spin_speed}">
            {#each large_flowering_args as arg}
                <div
                    class="petal {is_animate ? 'animate' : ''}"
                    style="--size:{`${large_round_size}px`}; --move_x: {arg.flower_petal_x}; --move_y: {arg.flower_petal_y}; --delay:{`${large_stroke_delay}s`}" />
            {/each}
        </div>
    </div>
</div>

<style lang="scss">
    .loader {
        position: relative;
        width: 100%;
        height: var(--loader_height);
        .fulcrum {
            position: absolute;
            width: 100%;
            height: 100%;
            .petals {
                position: absolute;
                top: calc(50% - (var(--size) / 2));
                left: calc(50% - (var(--size) / 2));
                width: var(--size);
                height: var(--size);
                transform: rotate(0);
                transform-origin: 50% 50%;
                &.animate {
                    animation: cycle linear var(--speed) infinite;
                }
            }
            @keyframes cycle {
                0% {
                    transform: rotate(0);
                }
                100% {
                    transform: rotate(360deg);
                }
            }
            .petal {
                position: absolute;
                top: 0;
                transform: rotate(var(--angle));
                width: var(--size);
                height: var(--size);
                border-radius: calc(var(--size) / 2);
                border: solid 1px var(--color);
                &.animate {
                    animation: flowering ease-in-out 2s var(--delay) infinite;
                }
                @keyframes flowering {
                    0% {
                        transform: translate(0, 0);
                    }
                    40% {
                        transform: translate(var(--move_x), var(--move_y));
                    }
                    80% {
                        transform: translate(0, 0);
                    }
                    100% {
                        transform: translate(0, 0);
                    }
                }
            }
        }
    }
</style>
