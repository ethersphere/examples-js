/* eslint-disable no-alert,no-console */
import axios from 'axios'
import { buildAxiosFetch } from '@lifeomic/axios-fetch'
import runExample from './support'

/**
 * Function `runExample` is where all the supporting and UI handling code is placed.
 * The main functionality that this example demonstrates is in the function
 * bellow where inputs are:
 *
 * @param bee Bee instance
 * @param batchId Postage Batch in order to write data to Bee
 * @param input File instance that contains the data to be uploaded
 * @param progressCb Simple callback that anything can be passed into and will be logged into the logging window on the page
 */
runExample(async (bee, batchId, input, progressCb) => {
  const axiosInstance = axios.create({
    onUploadProgress: progressCb
  })
  const fetch = buildAxiosFetch(axiosInstance)

  // @ts-ignore
  return await bee.uploadFile(batchId, input, undefined, { fetch })
})
