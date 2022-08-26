import { toast } from '@zerodevx/svelte-toast'
/* https://github.com/zerodevx/svelte-toast */

function toastPush(msg: string) {
    toast.push(msg)
}

function toastStay(msg: string) {
    toast.push(msg, {
        initial: 0,
        next: 0
    })
}

async function processingPush(msg: string) {
    const process = toast.push(msg, {
        initial: 0,
        progress: 0,
        dismissable: false
    })
    toast.set(process, { msg: msg + '...' })
}

function remove() {
    toast.pop()
}

function successToastPush(msg: string) {
    toast.pop()
    toast.push(msg, {
        theme: {
            '--toastBackground': '#48BB78',
            '--toastProgressBackground': '#2F855A'
        }
    })
}

function errorToastPush(errormsg: string) {
    toast.pop()
    const errorMsg = '<strong>Error</strong><br>' + errormsg
    toast.push(errorMsg, {
        theme: {
            '--toastBackground': '#F56565',
            '--toastProgressBackground': '#C53030'
        },
        duration: 10000,
        target: 'error'
    })
}

function errorToastStaying(errormsg: string) {
    toast.pop()
    const errorMsg = '<strong>Error</strong><br>' + errormsg
    toast.push(errorMsg, {
        theme: {
            '--toastBackground': '#F56565',
            '--toastProgressBackground': '#C53030'
        },
        target: 'error',
        initial: 0,
        next: 0
    })
}

const easytoast = {
    toastPush,
    toastStay,
    processingPush,
    remove,
    successToastPush,
    errorToastPush,
    errorToastStaying
}

export default easytoast
