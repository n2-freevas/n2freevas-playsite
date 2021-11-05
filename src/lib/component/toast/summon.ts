import { toast } from '@zerodevx/svelte-toast'
/* https://github.com/zerodevx/svelte-toast */

function toastPush(msg: string) {
  toast.push(msg)
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

const easytoast = {
  toastPush,
  processingPush,
  remove,
  successToastPush,
  errorToastPush
}

export default easytoast
