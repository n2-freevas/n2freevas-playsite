<script context="module" lang="ts">
    import type { cardModel, boardCardModel, deckCardModel, handCardModel } from '$lib/model/app/TCGsimModel'

    export function cardInAnywhere(
        card: boardCardModel | deckCardModel | handCardModel,
        cardList: boardCardModel[] | deckCardModel[] | handCardModel[],
        pushPosition: 'top' | 'bottom' = 'bottom' //配列の頭に要素を刺すかケツに刺すか。
    ): any {
        // if (pushPosition == "top"){ return [...cardList, card] }
        // else{ return [card, ...cardList] }
        if (pushPosition == 'top') {
            return [card, ...cardList]
        } else {
            return [...cardList, card]
        }
    }

    // あるところからカードが出る際の関数。出す対象のカードがあった位置をundefinedにした配列を返す。
    export function cardOutAnywhere(card_id: number, cardList: cardModel[]): any {
        // let list = Object.assign([],cardList)
        for (let i = 0; i < cardList.length; i++) {
            if (cardList[i]) {
                if (cardList[i].id == card_id) {
                    cardList[i] = undefined
                }
            }
        }
        return cardList
    }
</script>
