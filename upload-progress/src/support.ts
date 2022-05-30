/* eslint-disable no-alert,no-console */
import { Bee, BeeDebug, UploadResult } from '@ethersphere/bee-js'

type ProgressCb = (info: any) => void
type ExecutorCb = (bee: Bee, batchId: string, input: File, progressCb: ProgressCb) => Promise<UploadResult>

const BEE_URL = 'http://localhost:1633'
const BEE_DEBUG_URL = 'http://localhost:1635'

let sendBtn: HTMLButtonElement,
  resultLink: HTMLLinkElement, dataInput: HTMLInputElement, createBatchBtn: HTMLButtonElement, bee, beeDebug, logs: HTMLDivElement

async function createBatchGuide (): Promise<void> {
  if (!confirm('This will create new postage batch that requires on-chain transaction and spending Eth and BZZ! Do you want to continue?')) {
    return
  }

  try {
    const amount = prompt('What amount should the batch has? (integer)', '10')

    if (!amount) {
      return
    }

    const depthStr = prompt('What depth should the batch has (at least 17)? (integer)', '17')

    if (!depthStr) {
      return
    }

    createBatchBtn.disabled = true
    createBatchBtn.textContent = 'Creating...'

    ;(document.getElementById('batchId') as HTMLInputElement).value = await beeDebug.createPostageBatch(amount.toString(), parseInt(depthStr), {waitForUsable: true})

    createBatchBtn.disabled = false
    createBatchBtn.textContent = 'Create Postage Batch'
  } catch (e) {
    alert(e)
    createBatchBtn.disabled = false
    createBatchBtn.value = 'Create Postage Batch'
  }
}

function logProgress (input: any): void {
  const logEntry = document.createElement('div')
  logEntry.innerText = JSON.stringify(input, ['timeStamp', 'loaded', 'total'])

  logs.appendChild(logEntry)
}

async function formSubmitted (executor: ExecutorCb, e: Event): Promise<void> {
  e.preventDefault() // Lets not submit the form

  try {
    sendBtn.disabled = true
    sendBtn.value = 'Uploading...'
    logs.innerHTML = '' // Reset logging


    const file = dataInput.files.item(0)
    const batchId = (document.getElementById('batchId') as HTMLInputElement).value
    const {reference: result} = await executor(bee, batchId, file, logProgress)

    resultLink.href = `${BEE_URL}/files/${result}`
    resultLink.innerText = `Uploaded link: ${BEE_URL}/files/${result}`
  } catch (e) {
    alert(e)
  } finally {
    sendBtn.disabled = false
    sendBtn.value = 'Upload!'
  }
}

export default function runExample (executor: ExecutorCb): void {
  bee = new Bee(BEE_URL)
  beeDebug = new BeeDebug(BEE_DEBUG_URL)

  sendBtn = document.getElementById('send') as HTMLButtonElement
  resultLink = document.getElementById('result') as HTMLLinkElement
  logs = document.getElementById('content') as HTMLDivElement
  dataInput = document.getElementById('data') as HTMLInputElement
  createBatchBtn = document.getElementById('createBatchBtn') as HTMLButtonElement

  if (!createBatchBtn) {
    throw new Error('Create Batch Button does not exists')
  }

  createBatchBtn.addEventListener('click', createBatchGuide)

  document.getElementById('form')!.addEventListener('submit', formSubmitted.bind(undefined, executor))
}
