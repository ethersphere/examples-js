/* eslint-disable no-alert,no-console */
import { Bee, BeeDebug } from '@ethersphere/bee-js'

type OutputPrint = (content: string) => void
type ExecutorCb = (bee: Bee, reference: string, outputPrint: OutputPrint) => Promise<void>

const BEE_URL = 'http://localhost:1633'
const BEE_DEBUG_URL = 'http://localhost:1635'

let downloadButton: HTMLButtonElement, referenceInput: HTMLInputElement, bee, beeDebug, contentOutput: HTMLDivElement

function logProgress (input: any): void {
  const logEntry = document.createElement('div')
  logEntry.innerText = JSON.stringify(input, ['timeStamp', 'loaded', 'total'])

  contentOutput.appendChild(logEntry)
}

async function formSubmitted (executor: ExecutorCb, e: Event): Promise<void> {
  e.preventDefault() // Lets not submit the form

  try {
    downloadButton.disabled = true
    downloadButton.value = 'Downloading...'
    contentOutput.innerHTML = '' // Reset logging

    const reference = referenceInput.value
    await executor(bee, reference, logProgress)
  } catch (e) {
    alert(e)
  } finally {
    downloadButton.disabled = false
    downloadButton.value = 'Download!'
  }
}

export default function runExample (executor: ExecutorCb): void {
  bee = new Bee(BEE_URL)
  beeDebug = new BeeDebug(BEE_DEBUG_URL)

  downloadButton = document.getElementById('send') as HTMLButtonElement
  contentOutput = document.getElementById('content') as HTMLDivElement
  referenceInput = document.getElementById('reference') as HTMLInputElement

  document.getElementById('form')!.addEventListener('submit', formSubmitted.bind(undefined, executor))
}
