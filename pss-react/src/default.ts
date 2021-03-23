import { Bee, BeeDebug } from "@ethersphere/bee-js";

const beeApiUrl = process.env.REACT_APP_BEE_API_URL || 'http://localhost:1633'
const beeDebugApiUrl = process.env.REACT_APP_BEE_DEBUG_API_URL || 'http://localhost:1635'

export const bee = new Bee(beeApiUrl)
export const beedebug = new BeeDebug(beeDebugApiUrl)