import { useState } from "react"
import { Utils } from "@ethersphere/bee-js"
import { bee } from '../default'

export const SendForm = () => {

    const [address, setAddress] = useState('')
    const [text, setText] = useState('')
    const [overlayAddress, setOverlayAddress] = useState<string | null>('')
    const [error, setError] = useState<Error | null>(null)
    const [isSending, setSending] = useState(false)

    const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => setText(event.target.value)
    const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const addr = event.target.value
        setAddress(addr)

        let oa: string | null = null
        console.log(addr.length, /[0-9a-f]{64}/i.test(addr))
        try {
            if (/[0-9a-f]{64}/i.test(addr))
                oa = addr
            else
                oa = Utils.Eth.ethToSwarmAddress(addr)
            setError(null)
        } catch(e) {
            setError(e)
        }
        setOverlayAddress(oa)
    }
    const handleSend = async () => {
        if (overlayAddress) {
            try {
                setSending(true)
                const t = text
                setText('')
                await bee.pssSend('topic', overlayAddress?.substr(0,4), t)
            } catch (e) {
                setError(e)
            }
        }
        setSending(false)
    }
    
    return (
        <div className="send">
            <div>
            <div className="addressbar">
                <label>To: </label>
                <input placeholder="ETH address" value={address} onChange={handleAddressChange} />
            </div>

            <textarea placeholder="Write some message" value={text} onChange={handleTextChange} />

            <button onClick={handleSend}>
                Send
            </button>
            <div>
                {overlayAddress && <p><code>Recipient Swarm Address: {overlayAddress}</code></p>}
                {error && <p><code>{error.message}</code></p>}
                {isSending && <div><code>Sending...</code><div className="progress-line"/></div>}
            </div>
            </div>
        </div>
    )
}