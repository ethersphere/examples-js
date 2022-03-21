/* eslint-disable no-alert,no-console */
import { Utils } from "@ethersphere/bee-js";
import runExample from "./support";

/**
 * Function `runExample` is where all the supporting and UI handling code is placed.
 * The main functionality that this example demonstrates is in the function
 * bellow where inputs are:
 *
 * @param bee Bee instance
 * @param reference Bee Reference of the file to download
 * @param outputPrint Simple callback that print the passed parameter to the "Display window"
 */
runExample(async (bee, reference, outputPrint) => {
  const file = await bee.downloadReadableFile(reference);
  // @ts-ignore
  const nodeStream = Utils.readableWebToNode(file.data);
  const arr = [];

  nodeStream.on("data", (chunk) => arr.push(...chunk));
  nodeStream.on("end", () =>
    outputPrint(new TextDecoder().decode(new Uint8Array(arr)))
  );
});
