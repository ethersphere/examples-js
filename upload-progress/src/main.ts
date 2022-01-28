/* eslint-disable no-alert,no-console */
import axios from 'axios'
import { buildAxiosFetch } from '@lifeomic/axios-fetch'
import runExample from './support'

/**
 * Example code for tracking upload progress.
 *
 * @param bee Bee instance
 * @param batchId Postage Batch in order to write data to Bee
 * @param input File instance that contains the data to be uploaded
 * @param progressCb Simple callback that anything can be passed into and will be logged into the logging window on the page
 */
async function uploadProgressExample (bee, batchId, input, progressCb) {
  const axiosInstance = axios.create({
    onUploadProgress: progressCb,
  })
  const fetch = buildAxiosFetch(axiosInstance)

  // @ts-ignore
  return await bee.uploadFile(batchId, input, undefined, { fetch })
}

/**
 * Example code for tracking download progress.
 * FYI. if you need to track only downloading progress you don't have to use `axios-fetch` as you can do it with Fetch directly as well.
 * See for example: https://javascript.info/fetch-progress
 *
 * @param bee Bee instance
 * @param reference Reference to download
 * @param progressCb Simple callback that anything can be passed into and will be logged into the logging window on the page
 */
async function downloadProgressExample (bee, reference, progressCb) {
  const axiosInstance = axios.create({
    onDownloadProgress: (e) => {
      // By default the browser uses gzip and hence does not expose content-length
      // to the ProgressEvent which makes the `total` property zero.
      // Bee sends separate header with the decompressed size so here we replace it.
      // For context see: https://github.com/axios/axios/issues/1591
      e.total = e.target.getResponseHeader('decompressed-content-length')
      progressCb(e)
    },
  })
  const fetch = buildAxiosFetch(axiosInstance)

  // @ts-ignore
  return await bee.downloadFile(reference, undefined, { fetch })
}

/**
 * Function `runExample` is where all the supporting and UI handling code is placed.
 * The main functionality that this example demonstrates are in the functions above.
 */
runExample(uploadProgressExample, downloadProgressExample)
