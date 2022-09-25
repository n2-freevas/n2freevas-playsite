<script lang="ts">
    /* initialize variable */
    export let numof_pendulum: number = 16
    export let initial_length: number = 25
    export let increase_length: number = 12
    export let initial_size: number = 10
    export let increase_size: number = 0
    export let initial_frequency: number = 30
    export let decrease_frequency: number = 1
    export let color: string = 'white'
    export let is_animate: boolean = true

    interface PendulumArgs {
        wire_length: string
        weight_size: string
        periodic_time: string
    }

    let pendulums_args: PendulumArgs[] = []

    for (let i = 0; i < numof_pendulum; i++) {
        let wire_length = initial_length + i * increase_length
        let periodic_time: number = 60 / (initial_frequency - decrease_frequency * i)
        pendulums_args.push({
            wire_length: `${wire_length.toString()}px`,
            weight_size: `${(initial_size + i * increase_size).toString()}px`,
            periodic_time: `${periodic_time.toString()}s`
        })
    }
</script>

<div class="loader" style="--loader-height: {`${initial_length + increase_length * numof_pendulum + initial_size}px`};">
    <div class="fulcrum">
        {#each pendulums_args as args}
            <!-- Pendulum Part -->
            <div
                class="wire {is_animate ? 'animate' : ''}"
                style="--wire_length_px: {args.wire_length}; --periodic_time_sec: {args.periodic_time}; --color: {color};">
                <div class="weight" style="--weight_size_px: {args.weight_size};" />
            </div>
        {/each}
    </div>
</div>

<style lang="scss">
    .loader {
        position: relative;
        width: 100%;
        height: var(--loader-height);
        .fulcrum {
            position: absolute;
            left: 50%;
            height: 100%;
            .wire {
                position: absolute;
                height: var(--wire_length_px);
                border: solid 1px var(--color);
                transform-origin: top;
                &.animate {
                    -webkit-animation: penduluming ease-in-out var(--periodic_time_sec) infinite;
                    animation: penduluming ease-in-out var(--periodic_time_sec) infinite;
                }
                .weight {
                    position: absolute;
                    bottom: calc(-1 * (var(--weight_size_px) / 2));
                    left: calc(-1 * (var(--weight_size_px) / 2));
                    width: var(--weight_size_px);
                    height: var(--weight_size_px);
                    border-radius: calc(var(--weight_size_px) / 2);
                    background: var(--color);
                }
            }
        }
    }
    @keyframes penduluming {
        0% {
            transform: rotate(30deg);
        }
        50% {
            transform: rotate(-30deg);
        }
        100% {
            transform: rotate(30deg);
        }
    }
</style>
