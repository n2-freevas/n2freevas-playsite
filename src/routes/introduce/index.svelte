<script lang="ts">
    import { onMount } from "svelte";
    const myname = 'Making' //'Taro <span style="color:#ff0000">N</span>onoyama'
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
    const backgroundIllust = ['https://lh3.googleusercontent.com/bcvBUbA1fI0nUqannPAJxes6L1JmFm4VdhfjCwq6fkvqgoBHlGoVJhMk-L20s5zscQZe8FO9d3x4u757Gk35od1rhy8wbOlOEHDt0GULdy7Af2oI_TMadzt4mohs-okGaJoaYaxq27I9HXPCNyoO_cv5nSEM2WlUNF_KKNMW-Hv-0RJkpREnBwzn-HPzuP9lXk5VVIhIcNEwspqsh4n_byo-SlBOOnDX6YDSI_iPzQOftJTfIoZupSXt7yT0eTX4X3G4iU7l0oJd72Mm72_4xAgAw9Ogoyy2wOx_f9TY3hLZWqO1n94DOM0GxWtE-YbfX_LxLRbAzbIUk4IGhl0eNUNfY-w-zg6DjNe0EgQ0MlgBbQH7GDUa-0va2ppQwNTdU_nJIlBBlFa5MCEaBrc3WJZuN1uC7Od7bgY2w3l9_zTajyvYMDRK40k0jlJjqUov2v5QmbAOwVap49VF1bNQrqZsKN-KaCuVeBZHOsA33U28f7qE5Pw2V1g0nUvcYGjBgSyIjX0d-4abQnpNO_AAP5mKUhiMHPAxc1SJne8b_AQMPQNk0qAdO_-I68Eb1nN2LdKyk2Ca4YWqGb2OTQyyewAaxnYhPY9tTXCMxU18r2NVuJWDmrzXaNab3s_rjdMwn1zW5sxrJEpqFu2Av7wPWQ5PRbbPBZVVid_jh8slBbZLULwQ7qLRbn3L-opMCJzUq748fEL2GXe1wWK1G87Fw_I=s700-no']
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
                {`( ${myAgeDay}d ${myAgeHour}h ${myAgeMinutes}m ${myAgeSecond}s )`}
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
                margin:10px 0;
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
