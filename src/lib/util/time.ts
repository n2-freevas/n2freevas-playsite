// 指定ミリ秒待機する関数
export async function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}
