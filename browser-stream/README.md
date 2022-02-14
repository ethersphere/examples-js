# Browser stream

If you want to use the Bee's `Utils.readableWebToNode()` utility function in browser you
have to install `readable-stream` and polyfill `process` and `buffer` packages.
This example demonstrates its usage.

### Prerequisites

 - Node and NPM
- Bee instance running with API port on 1633 and Debug API port on 1635 and having flag `--cors-allowed-origins="*"`

### Steps:

1. Run `npm ci` and `npm start`
2. Browser window should open with the example page
3. Upload some preferably text data with for example [swarm-cli](https://github.com/ethersphere/swarm-cli)
4. Input the reference into the input field and click `Download` button.
5. The content should be displayed.

### Code

The interesting code parts are found in `src/main.ts` file.
