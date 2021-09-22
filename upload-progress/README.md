# Upload progress tracking

Currently, bee-js does not natively support upload progress as it is using `fetch` based HTTP client
that unfortunately does not support this feature at the moment (please comment on the appropriate
[fetch spec issue](https://github.com/whatwg/fetch/issues/607) to raise momentum for this to happen).
<br><br>

Nevertheless, there is a workaround using a library called [`axios-fetch`](https://github.com/lifeomic/axios-fetch)
that implements `fetch` API with XHR based HTTP client that supports tracking upload progress, that we will present to you in this example.

### Prerequisites

 - Node and NPM
 - Bee instance running with API port on 1633 and having flag `--cors-allowed-origins="*"`

### Steps:

1. Run `npm install` and `npm start`
2. Browser window should open with the example page
3. Create a new Postage Batch or input already existing one
4. Choose file to upload and hit "Upload!" button
5. See how progress is logged in the "Logging progress" window

### Code

*Tip! Checkout the browser console to see the steps the example is doing!*

The interesting code parts are found in `src/main.ts` file.

#### Note

Currently, the `axios-fetch` is not compatible with `bee-js`, but there is [PR](https://github.com/lifeomic/axios-fetch/pull/86)
that will hopefully soon fix that. In mean time this example uses the branch that the PR is based on.
