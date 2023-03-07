/* eslint-disable no-alert,no-console */
import { Bee, BeeDebug, UploadResult } from '@ethersphere/bee-js'

type ProgressCb = (info: any) => void;
type UploadExecutorCb = (
  bee: Bee,
  batchId: string,
  input: File,
  progressCb: ProgressCb,
) => Promise<UploadResult>;

type DownloadExecutorCb = (
  bee: Bee,
  reference: string,
  progressCb: ProgressCb,
) => Promise<UploadResult>;

const BEE_URL = 'http://localhost:1633'
const BEE_DEBUG_URL = 'http://localhost:1635'

let uploadBtn: HTMLButtonElement,
  downloadBtn: HTMLButtonElement,
  resultLink: HTMLLinkElement,
  uploadInput: HTMLInputElement,
  referenceInput: HTMLInputElement,
  createBatchBtn: HTMLButtonElement,
  bee,
  beeDebug,
  logs: HTMLDivElement

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

    ;(document.getElementById('batchId') as HTMLInputElement).value = await beeDebug.createPostageBatch(amount.toString(), parseInt(depthStr))

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

async function uploadFormSubmitted (
  executor: UploadExecutorCb,
  e: Event,
): Promise<void> {
  e.preventDefault() // Lets not submit the form

  try {
    uploadBtn.disabled = true
    uploadBtn.value = 'Uploading...'
    logs.innerHTML = '' // Reset logging

    const file = uploadInput.files.item(0)
    const batchId = (document.getElementById('batchId') as HTMLInputElement)
      .value
    const { reference: result } = await executor(
      bee,
      batchId,
      file,
      logProgress,
    )

    resultLink.href = `${BEE_URL}/files/${result}`
    resultLink.innerText = `Uploaded link: ${BEE_URL}/files/${result}`
  } catch (e) {
    alert(e)
  } finally {
    uploadBtn.disabled = false
    uploadBtn.value = 'Upload!'
  }
}

async function downloadFormSubmitted (
  executor: DownloadExecutorCb,
  e: Event,
): Promise<void> {
  e.preventDefault() // Lets not submit the form

  try {
    downloadBtn.disabled = true
    downloadBtn.value = 'Downloading...'
    logs.innerHTML = '' // Reset logging

    const reference = referenceInput.value
    await executor(bee, reference, logProgress)
  } catch (e) {
    alert(e)
  } finally {
    downloadBtn.disabled = false
    downloadBtn.value = 'Download!'
  }
}

export default function runExample (
  uploadExecutor: UploadExecutorCb,
  downloadExecutor: DownloadExecutorCb,
): void {
  bee = new Bee(BEE_URL)
  beeDebug = new BeeDebug(BEE_DEBUG_URL)

  uploadBtn = document.getElementById('upload') as HTMLButtonElement
  downloadBtn = document.getElementById('download') as HTMLButtonElement
  resultLink = document.getElementById('result') as HTMLLinkElement
  logs = document.getElementById('logs') as HTMLDivElement
  uploadInput = document.getElementById('data') as HTMLInputElement
  referenceInput = document.getElementById('reference') as HTMLInputElement
  createBatchBtn = document.getElementById(
    'createBatchBtn',
  ) as HTMLButtonElement

  if (!createBatchBtn) {
    throw new Error('Create Batch Button does not exists')
  }

  createBatchBtn.addEventListener('click', createBatchGuide)

  document
    .getElementById('uploadForm')!
    .addEventListener(
      'submit',
      uploadFormSubmitted.bind(undefined, uploadExecutor),
    )

  document
    .getElementById('downloadForm')!
    .addEventListener(
      'submit',
      downloadFormSubmitted.bind(undefined, downloadExecutor),
    )
}
