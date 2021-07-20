/* eslint-disable no-alert,no-console */
const BEE_URL = 'http://localhost:1633'

/**
 * The `/bzz` endpoint accepts only Manifest/Collection so we have to build one.
 *
 * @param message
 * @param bee
 * @param batchId
 * @returns {Promise<Reference>}
 */
function createDummyCollection(message, bee, batchId) {
  const blob = new Blob([`<h1>${message}</h1>`], { type: 'text/html' })
  const file = new File([blob], 'index.html', { type: 'text/html' })

  return bee.uploadFiles(batchId, [file])
}

function main() {
  if (typeof window.ethereum === 'undefined') {
    alert('Metamask is not installed or enabled!')

    // We don't want nothing with browsers that does not have Eth Wallet!
    return
  }
  const bee = new BeeJs.Bee(BEE_URL)

  const sendBtn = document.getElementById('send')
  const resultLink = document.getElementById('result')
  const createBatchBtn = document.getElementById('createBatchBtn')

  createBatchBtn.addEventListener('click', async e => {
    if (!confirm('This will create new postage batch that requires on-chain transaction and spending Eth and BZZ! Do you want to continue?')) {
      return
    }

    try{
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

      document.getElementById('batchId').value = await bee.createPostageBatch(amount.toString(), parseInt(depthStr))

      createBatchBtn.disabled = false
      createBatchBtn.textContent = 'Create Postage Batch'
    } catch (e){
      alert(e)
      createBatchBtn.disabled = false
      createBatchBtn.value = 'Create Postage Batch'
    }
  })

  document.getElementById('form').addEventListener('submit', async e => {
    e.preventDefault() // Lets not submit the form

    try {
      sendBtn.disabled = true
      sendBtn.value = 'Uploading...'

      console.log('Creating signer')
      const signer = await BeeJs.Utils.Eth.makeEthereumWalletSigner(window.ethereum)
      console.log(`Signer for address 0x${BeeJs.Utils.Hex.bytesToHex(signer.address)} created.`)

      // Upload the data as normal content addressed chunk
      console.log('Uploading data as regular chunk')
      const batchId = document.getElementById('batchId').value
      const data = document.getElementById('data').value
      const dataHash = await createDummyCollection(data, bee, batchId)
      console.log('Uploaded data with hash: ', dataHash)


      // Now write the chunk's hash to the feed
      const rawTopic = document.getElementById('topic').value
      const topic = bee.makeFeedTopic(rawTopic)
      console.log(`Hashed topic for ${rawTopic}: ${topic}`)
      const writer = bee.makeFeedWriter('sequence', topic, signer)
      console.log('Writing to Feed')
      const result = await writer.upload(batchId, dataHash)
      console.log('Feed write result hash: ', result.reference)

      console.log('Verifying the Feed with re-download')
      const feedVerification = await writer.download()
      console.log('Verification result: ', feedVerification.reference === dataHash)

      // Lets create chunk hash for manifest that can be used with the BZZ endpoint
      const resultUrl = `${BEE_URL}/bzz/${await bee.createFeedManifest(batchId, 'sequence', topic, signer.address)}/index.html`
      console.log('Feed Manifest URL: ' + resultUrl)

      resultLink.href = resultUrl
      resultLink.innerHTML = `Manifest URL: ${resultUrl}`
    } catch (e) {
      alert(e)
    } finally {
      sendBtn.disabled = false
      sendBtn.value = 'Sign and upload!'
    }
  })
}

main()
