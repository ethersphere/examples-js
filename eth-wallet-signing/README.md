# Eth Wallet as a Signer

This example demonstrates how to use Ethereum browser wallets like Metamask or Nifty as a signers for Feeds.

### Prerequisites

 - Node and NPM
 - browser with Ethereum compatible wallet like Metamask or Nifty
 - Bee instance running with API port on 1633 and having flag `--cors-allowed-origins="*"`

### Steps:

1. Run `npm install` and `npm start`
1. Put some message, topic and hit the "Sign and upload!" button
1. Authenticate the message with your wallet  **For your own safety use an account without any real funds!!!**
1. Open the created link and see your message
1. Now put some other message and upload it and refresh the page to see the content changed under the same URL

**Be aware! The wallets won't be injected into files served using `file://` in browsers! Load `src/index.html` with the development server which is run with the `npm start`!**

### Code

*Tip! Checkout the browser console to see the steps the example is doing!*

The interesting code parts are found in `src/main.ts` file. We are using utility supplied by `bee-js` 
called [`makeEthereumWalletSigner`](https://bee-js.ethswarm.org/docs/api/functions/utils.makeEthereumWalletSigner) that takes EIP-1193 compatible Ethereum provider 
and create custom [`Signer`](https://bee-js.ethswarm.org/docs/api/interfaces/signer).
