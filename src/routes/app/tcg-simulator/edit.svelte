<script lang="ts">
    import {deckListStore, exDeckListStore,
            unshuffleDeckListStore, unshuffleExDeckListStore} from '$lib/store/app/TCGsimStore'
    import { deckShuffle } from '$lib/component/TCG-sim/deck.svelte'
    function onFileSelected(e){
        $deckListStore = []
        $exDeckListStore = []
        const files:File[] = e.target.files;
        let images:File[] = []
        let sleeve:string | ArrayBuffer = "/img/tcg-sim/card.svg"
        let id = 0
        console.log(files)
        for(let i=0; i < files.length; i++){
            if(files[i].type.includes('image')){
                if(files[i].name.includes('sleeve')){
                    let reader = new FileReader();
                    reader.readAsDataURL(files[i]);
                    reader.onload =(e) => {
                        sleeve = e.target.result
                    }
                } else {
                    images.push(files[i])
                }
            }
        }
        console.log(images)
        for(let i=0; i < images.length; i++){
            let reader = new FileReader();
            reader.readAsDataURL(images[i]);
            reader.onload = (e) => {
                let count = 1
                let match:string[] = images[i].name.match(/\[[0-9]*\]/g)
                if (match){
                    count = Number.parseInt(match[0].replace('[','').replace(']',''))
                }
                console.log(match, images[i].name,count)
                if(images[i].webkitRelativePath.includes('/extra')){
                    for(let j=0; j<count; j++){
                        $unshuffleExDeckListStore.push({
                            id:id,
                            //@ts-ignore
                            url: e.target.result,
                            //@ts-ignore
                            burl: sleeve,
                            x:0,y:0,flip: true,rotate:0
                        })
                        id += 1
                    }
                    
                }
                else{
                    for(let j=0; j<count; j++){
                        $unshuffleDeckListStore.push({
                            id:id,
                            //@ts-ignore
                            url: e.target.result,
                            //@ts-ignore
                            burl: "/img/tcg-sim/card.svg",
                            x:0,y:0,flip: true,rotate:0
                        })
                        id += 1
                    }
                }
                if(i == images.length -1){
                    let usexd = $unshuffleExDeckListStore
                    let usd = $unshuffleDeckListStore
                    $unshuffleExDeckListStore = usexd
                    $unshuffleDeckListStore = usd
                    $exDeckListStore = deckShuffle(usexd)
                    $deckListStore  = deckShuffle(usd)
                    console.log($deckListStore)
                    console.log($exDeckListStore)
                }
            };
        }
    }
</script>


<input type="file" webkitdirectory on:change={(e)=>onFileSelected(e)}/>
<section id='deck'>
    {#each $unshuffleDeckListStore as d}
        <img src={d.url} alt =''>
    {/each}
</section>
<section id='exdeck'>
    {#each $unshuffleExDeckListStore as e}
        <img src={e.url} alt =''>
    {/each}
</section>

<style lang="scss">
    :root{
        --card-width: 85px;
        --card-margin: 5px;
    }
    img{
        border-radius: 10px;
        width:var(--card-width);
        margin: var(--card-margin);
    }
    #deck, #exdeck{
        display: flex;
        width:calc(var(--card-width) * 10 + var(--card-margin) * 20);
        margin:0 auto;
        flex-wrap: wrap;
    }
    
</style>
