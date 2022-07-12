<script lang="ts">
    import {deckListStore, exDeckListStore,
        unshuffleDeckListStore, unshuffleExDeckListStore} from '$lib/store/app/TCGsimStore'
    import type { deckCardModel } from '$lib/model/app/TCGsimModel';
    
    let installComplete = true //fileLoaderが非同期なのでこやつを用いて強制的に同期させる
    let deckLength:number = 0
    let exDeckLength:number = 0
    let deckList: deckCardModel[] = []
    let exDeckList: deckCardModel[] = []
    

    async function onFileSelected(e){
        // インストール開始の合図
        installComplete = false

        //一時的にクラスを定義
        class FileReaderEx extends FileReader{
            constructor(){
                super();
            }

            _readAs(blob, ctx){
                return new Promise((res, rej)=>{
                    super.addEventListener("load", ({target}) => res(target.result));
                    super.addEventListener("error", ({target}) => rej(target.error));
                    super[ctx](blob);
                });
            }

            readAsArrayBufferEx(blob){
                return this._readAs(blob, "readAsArrayBuffer");
            }

            readAsDataURLEx(blob){
                return this._readAs(blob, "readAsDataURL");
            }

            readAsTextEx(blob){
                return this._readAs(blob, "readAsText");
            }
        }
        
        // リストを初期化
        deckList = []
        exDeckList = []
        
        const files:File[] = e.target.files;
        let images:File[] = []
        let sleeve:string | ArrayBuffer = "/img/tcg-sim/card.svg"
        let id = 0
        // 同期して、指定したファイルの内容物を取得
        console.log('[input files]:',files)
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
        // この時点で、ファイルにある対象の画像のみを取得済み。
        console.log('[attempt images]:',images)
        for(let i=0; i < images.length; i++){
        
            let result = await new FileReaderEx().readAsDataURLEx(images[i]);    
            // 画像のカードが何枚必要か取得。取得できない場合は1枚とみなす
            let count = 1
            let match:string[] = images[i].name.match(/\[[0-9]*\]/g)
            if (match){
                count = Number.parseInt(match[0].replace('[','').replace(']',''))
            }
            // extraフォルダは別個管理する。
            if(images[i].webkitRelativePath.includes('/extra')){
                for(let j=0; j<count; j++){
                    exDeckList.push({
                        id:id,
                        //@ts-ignore
                        url: result,
                        //@ts-ignore
                        burl: sleeve,
                        x:0,y:0,z:0,flip: true,rotate:0
                    })
                    id += 1
                }
                
            }
            // extra以外のフォルダに格納されたカードデータをロードする
            else{
                for(let j=0; j<count; j++){
                    deckList.push({
                        id:id,
                        //@ts-ignore
                        url: result,
                        //@ts-ignore
                        burl: "/img/tcg-sim/card.svg",
                        x:0,y:0,z:0,flip: true,rotate:0
                    })
                    id += 1
                }
            }
        }
        $unshuffleDeckListStore = deckList //参照渡し
        $unshuffleExDeckListStore = exDeckList //参照渡し
        $exDeckListStore = exDeckList.concat() //実質値渡し
        $deckListStore  = deckList.concat() //実質値渡し
        deckLength = deckList.length
        exDeckLength = deckList.length
        console.log($unshuffleDeckListStore)
        console.log($deckListStore)
    }

</script>


<input type="file" webkitdirectory on:change={(e)=>onFileSelected(e)}/>
<p>デッキ枚数：{$unshuffleDeckListStore.length}</p>
<section id='deck' style="--wrap_num:12">
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
        width:calc(var(--card-width) * var(--wrap_num) + var(--card-margin) * ( var(--wrap_num) *2 ));
        margin:0 auto;
        flex-wrap: wrap;
    }
    
</style>
