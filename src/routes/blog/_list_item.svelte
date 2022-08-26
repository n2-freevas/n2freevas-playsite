<script lang="ts">
    import type { NotionTag } from '$lib/store/NotionModels'
    import MediaQuery from 'svelte-media-query'

    export let id
    export let tags: NotionTag[]
    export let title
    export let thumbnail
</script>

<MediaQuery query="(max-width: 700px)" let:matches>
    {#if matches}
        <div class="items_phone">
            <div class="info_container">
                <a href="/blog/page?page_id={id}"><h3>{@html title}</h3></a>
                <div class="tag_container">
                    {#each tags as tag}
                        <div class="tag_box {tag.tag_color}">
                            {tag.tag_name}
                        </div>
                    {/each}
                </div>
            </div>
            <div class="thumbnail_container">
                <a href="/blog/page?page_id={id}">
                    <img src={thumbnail} alt="{title}の画像" />
                </a>
            </div>
        </div>
    {/if}
</MediaQuery>

<MediaQuery query="(min-width: 701px)" let:matches>
    {#if matches}
        <div class="items">
            <div class="info_container">
                <a href="/blog/page?page_id={id}"><h3>{@html title}</h3></a>
                <div class="tag_container">
                    {#each tags as tag}
                        <div class="tag_box {tag.tag_color}">
                            {tag.tag_name}
                        </div>
                    {/each}
                </div>
            </div>
            <div class="thumbnail_container">
                <a href="/blog/page?page_id={id}">
                    <img src={thumbnail} alt="{title}の画像" />
                </a>
            </div>
        </div>
    {/if}
</MediaQuery>

<style lang="scss">
    .items {
        margin: 20px 0px;
        border: solid 1px black;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        height: 175px;
        .info_container {
            padding: 20px 40px;
            width: 50%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            h3 {
                font-size: 25px;
                color: black;
            }
        }
        .thumbnail_container {
            overflow: hidden;
            width: 50%;
            max-width: 432px;
        }
    }
    .items_phone {
        margin: 20px 0px;
        border: solid 1px black;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .info_container {
            padding: 15px 30px;
            h3 {
                font-size: 20px;
                color: black;
                margin: 10px 0;
            }
        }
        .thumbnail_container {
            overflow: hidden;
            width: 100%;
            height: 200px;
        }
    }
    .tag_container {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        .tag_box {
            margin: 5px;
            padding: 5px 10px;
            border-radius: 2px;
            background: rgb(133, 133, 133);
            font-size: 13px;
            &.default {
                background: black;
                border: solid 1px #444444;
            }
            &.gray {
                background: #525252;
                border: solid 1px #444444;
            }
            &.brown {
                background: #613c1a;
                border: solid 1px #444444;
            }
            &.orange {
                background: #b95a00;
                border: solid 1px #444444;
            }
            &.yellow {
                background: #e4a700;
                border: solid 1px #444444;
            }
            &.green {
                background: #135e00;
                border: solid 1px #444444;
            }
            &.blue {
                background: #000a9b;
                border: solid 1px #444444;
            }
            &.purple {
                background: #3d008d;
                border: solid 1px #444444;
            }
            &.pink {
                background: #a80076;
                border: solid 1px #444444;
            }
            &.red {
                background: #880000;
                border: solid 1px #880000;
            }
        }
    }
</style>
