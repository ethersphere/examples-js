/* eslint-disable no-alert,no-console */

import { Bee, BeeDebug, Reference } from '@ethersphere/bee-js'

type ExecutorCb = (bee: Bee, batchId: string, inputHash: Reference, topic: string) => Promise<string>

const BEE_URL = 'http://localhost:1633'
const BEE_DEBUG_URL = 'http://localhost:1635'
let sendBtn: HTMLButtonElement,
  resultLink: HTMLLinkElement, dataInput: HTMLInputElement, createBatchBtn: HTMLButtonElement, bee, beeDebug

/**
 * The `/bzz` endpoint accepts only Manifest/Collection so we have to build one.
 *
 * @param message
 * @param bee
 * @param batchId
 * @returns {Promise<Reference>}
 */
function createDummyCollection (message, bee, batchId) {
  const blob = new Blob([`<h1>${message}</h1>`], { type: 'text/html' })
  const file = new File([blob], 'index.html', { type: 'text/html' })

  return bee.uploadFiles(batchId, [file])
}

async function createBatchGuide (): Promise<void> {
  if (!confirm('This will create new postage batch that requires on-chain transaction and spending Eth and BZZ! Do you want to continue?')) {
    return
  }

  try {
    const amount = prompt('What amount should the batch has? (integer)', '10')

    if (!amount) {
      return
    }

    const depthStr = prompt('What depth should the batch has (at least 16)? (integer)', '17')

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

async function formSubmitted (executor: ExecutorCb, e: Event): Promise<void> {
  e.preventDefault() // Lets not submit the form

  try {
    sendBtn.disabled = true
    sendBtn.value = 'Uploading...'

    const batchId = (document.getElementById('batchId') as HTMLInputElement).value
    const data = (document.getElementById('data') as HTMLInputElement).value
    const topic = (document.getElementById('topic') as HTMLInputElement).value
    const { reference: dataHash } = await createDummyCollection(data, bee, batchId)

    const resultUrl = await executor(bee, batchId, dataHash, topic)

    resultLink.href = `${BEE_URL}${resultUrl}`
    resultLink.innerHTML = `Manifest URL: ${BEE_URL}${resultUrl}`
  } catch (e) {
    alert(e)
  } finally {
    sendBtn.disabled = false
    sendBtn.value = 'Sign and upload!'
  }
}


export default function runExample (executor: ExecutorCb): void {
  // @ts-ignore
  if (typeof window.ethereum === 'undefined') {
    alert('Metamask is not installed or enabled!')

    // We don't want nothing with browsers that does not have Eth Wallet!
    return
  }

  bee = new Bee(BEE_URL)
  beeDebug = new BeeDebug(BEE_DEBUG_URL)

  sendBtn = document.getElementById('send') as HTMLButtonElement
  resultLink = document.getElementById('result') as HTMLLinkElement
  dataInput = document.getElementById('data') as HTMLInputElement
  createBatchBtn = document.getElementById('createBatchBtn') as HTMLButtonElement

  if (!createBatchBtn) {
    throw new Error('Create Batch Button does not exists')
  }

  createBatchBtn.addEventListener('click', createBatchGuide)

  document.getElementById('form')!.addEventListener('submit', formSubmitted.bind(undefined, executor))
}
