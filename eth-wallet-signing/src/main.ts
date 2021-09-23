/* eslint-disable no-alert,no-console */
import runExample from './support'
import { Utils } from '@ethersphere/bee-js'

/**
 * Function `runExample` is where all the supporting and UI handling code is placed.
 * The main functionality that this example demonstrates is in the function
 * bellow where inputs are:
 *
 * @param bee Bee instance
 * @param batchId Postage Batch in order to write data to Bee
 * @param inputHash The data inputted by the user already uploaded in dummy collection
 * @param rawTopic topic as user inputted it
 */
runExample( async (bee, batchId, inputHash, rawTopic) => {
  console.log('Creating signer')
  // @ts-ignore
  const signer = await Utils.makeEthereumWalletSigner(window.ethereum)
  console.log(`Signer for address 0x${Utils.bytesToHex(signer.address)} created.`)

  // Upload the data as normal content addressed chunk
  console.log('Uploading data as regular chunk')
  console.log('Uploaded data with hash: ', inputHash)

  // Now write the chunk's hash to the feed
  const topic = bee.makeFeedTopic(rawTopic)
  console.log(`Hashed topic for ${rawTopic}: ${topic}`)
  const writer = bee.makeFeedWriter('sequence', topic, signer)
  console.log('Writing to Feed')
  const result = await writer.upload(batchId, inputHash)
  console.log('Feed write result hash: ', result)

  console.log('Verifying the Feed with re-download')
  const feedVerification = await writer.download()
  console.log('Verification result: ', feedVerification.reference === inputHash)

  // Lets create chunk hash for manifest that can be used with the BZZ endpoint
  const resultUrl = `/bzz/${await bee.createFeedManifest(batchId, 'sequence', topic, signer.address)}/index.html`
  console.log('Feed Manifest URL: ' + resultUrl)

  return resultUrl
})
