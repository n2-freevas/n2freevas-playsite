<script lang="ts">
    import { onMount } from "svelte";
    const myname = 'Taro Nonoyama' //'Taro <span style="color:#ff0000">N</span>onoyama'
    const mySex = 'Male'
    const myBloodType = 'A Rh+'
    const myBirthDay = new Date('1996-09-30T00:26:29+09:00')
    let myAgeYear = 0
    let myAgeDay = 0
    let myAgeHour = 0
    let myAgeMinutes = 0
    let myAgeSecond = 0
    let myAgeMillieSecond = 0
    let ticktockInterval = 1000
    const myJob = ['Engineer', 'Designer', 'Artist']
    const backgroundIllust = ['']
    const calcElapsedYear = ( s , e )=>e.getFullYear() === s.getFullYear()
            ? 0
            : (e.getFullYear() - s.getFullYear() -1 )
            + ( (( 12 - s.getMonth()  ) + ( e.getMonth() + 1 ) >= 13 ) ? 1 : 0);
    onMount(async()=>{
        myAgeYear = calcElapsedYear(myBirthDay, new Date())
        let ts = new Date().getTime() - myBirthDay.getTime()
        let milliesec = 1000
        myAgeMillieSecond = Math.floor((ts) % 1000)
        let sec = milliesec * 60
        myAgeSecond = Math.floor((ts/milliesec)%60)
        let minutes = sec * 60
        myAgeMinutes = Math.floor((ts/sec) % 60)
        let hour = minutes * 24
        myAgeHour = Math.floor((ts/minutes) % 24)
        myAgeDay = Math.floor((ts / (hour)) % 365)
        setInterval(ticktockMyAge, ticktockInterval)
    })

    async function ticktockMyAge(){
        myAgeSecond+=1
        if(myAgeSecond >= 60){
            myAgeSecond = 0
            myAgeMinutes += 1
        }
        if(myAgeMinutes >= 60){
            myAgeMinutes = 0
            myAgeHour += 1
        }
        if(myAgeHour >= 24){
            myAgeHour = 0
            myAgeDay += 1
        }
        if(myAgeDay >= 365){
            myAgeYear += 1
        }
    }
</script>
<section id='introduce-box'>
    <div class='image' style='--url:url({backgroundIllust[0]})'></div>
    <div id='introduce-text'>
        <h1>{@html myname}</h1>
        <div class='job'>{myJob.join(', ')}</div>
        <div class='birthday'>
            {`Age ${myAgeYear}`}
            <div class='birthday-count'>
                {`( ${myAgeDay}day ${myAgeHour}hour ${myAgeMinutes}minutes ${myAgeSecond}seconds )`}
            </div>
        </div>
        <div>{mySex}</div>
        <div>{myBloodType}</div>
    </div>
</section>

<style lang="scss">
    #introduce-box{
        position: relative;
        width: 80%;
        max-width: 700px;
        margin:30px auto 0 auto;
        height:700px;
        #introduce-text{
            padding:30px;
            div{
                margin:5px;
            }
            h1{
                margin:30px 0;
            }
            .job{
                margin:10px 5px;
                font-size: 16px;
            }
            .birthday{
                
                .birthday-count{
                    display: inline;
                    font-size:13px;
                }
            }
        }
    .image{
            z-index: -1;
            position: absolute;
            filter: blur(2px);
            background-image: var(--url);
            background-position: center;
            width:100%;
            height:100%;
        }
}


</style>
