<script lang="ts">
    export let color: string = 'white'
    // export let is_animate: boolean = true
    export let dot_size: number = 10
    export let input: number = 1056194

    let dot_string_dict = {
        0: [1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1],
        1: [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
        2: [1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1],
        3: [1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1],
        4: [1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 1],
        5: [1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1],
        6: [1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1],
        7: [1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
        8: [1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1],
        9: [1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 1]
    }

    interface dot_infomation_args {
        dots: number[]
    }

    let input_tostr = input.toString()
    let dot_args: dot_infomation_args[] = []

    for (let i = 0; i < input_tostr.length; i++) {
        dot_args.push({
            dots: dot_string_dict[input_tostr[i]]
        })
    }
    console.log(dot_args)
    console.log(Math.floor(100 / input_tostr.length))
</script>

<div class="loader">
    <div class="board" style="--color:{color}; --dot_area_width:{Math.floor(100 / input_tostr.length)}%; --dot_size:{`${dot_size}px`}">
        {#each dot_args as args}
            <div class="dot_area">
                {#each args.dots as dot}
                    {#if dot == 0}
                        <div class="blank" />
                    {:else}
                        <div class="dot" />
                    {/if}
                {/each}
            </div>
        {/each}
    </div>
</div>

<style lang="scss">
    .loader {
        width: 100%;
        height: 100%;
        .board {
            display: flex;
            flex-direction: row;
            justify-content: space-around;
            width: 100%;
            height: 100%;
            .dot_area {
                padding: 5px;
                flex-basis: var(--dot_area_width);
                //width:10%;
                display: flex;
                flex-direction: row;
                justify-content: center;
                flex-wrap: wrap;
                .dot,
                .blank {
                    flex-basis: 32%;
                    width: var(--dot_size);
                    height: var(--dot_size);
                }
                .dot {
                    background: var(--color);
                }
            }
        }
    }
</style>
