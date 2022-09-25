<script lang="ts">
    /* initialize variable */
    export let numof_rectangle: number = 20
    export let base_rect_width: number = 15
    export let blur_range_rect_width: number = 10
    export let formation_interval: number = 10
    export let growth_delay_sec: number = 0.25
    export let max_height: number = 150
    export let color: string = 'white'
    export let is_animate: boolean = true

    interface RectangleArgs {
        rect_width: string
        interval_position: string
        growth_delay: string
    }

    let rectangle_args: RectangleArgs[] = []

    for (let i = 0; i < numof_rectangle; i++) {
        rectangle_args.push({
            rect_width: `${Math.floor(Math.random() * blur_range_rect_width + base_rect_width - blur_range_rect_width / 2)}px`,
            interval_position: `${formation_interval * (numof_rectangle / 2 - i)}px`,
            growth_delay: `${growth_delay_sec * i}s`
        })
    }
</script>

<div class="loader" style="--loader-height: {`${77 + max_height}px`};">
    <div class="fulcrum {is_animate ? 'animate' : ''}" style="--base_width:{`${base_rect_width}px`}; --max_height:{`${max_height}px`};">
        {#each rectangle_args as args}
            <div
                class="rect {is_animate ? 'animate' : ''}"
                style="--width:{args.rect_width}; --color: {color}; --interval: {args.interval_position}; --growth_delay: {args.growth_delay}" />
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
            width: 100%;
            height: 100%;
            left: 0;
            .rect {
                position: absolute;
                bottom: 0;
                left: calc(50% + var(--interval));
                width: var(--width);
                height: 0;
                border: solid 1px var(--color);
                &.animate {
                    -webkit-animation: rect_growth ease-in-out 3s var(--growth_delay) infinite;
                    animation: rect_growth ease-in-out 3s var(--growth_delay) infinite;
                }
                @keyframes rect_growth {
                    0% {
                        height: 0;
                    }
                    20% {
                        height: var(--max_height);
                    }
                    40% {
                        height: 0;
                    }
                    100% {
                        height: 0;
                    }
                }
            }
        }
    }
</style>
