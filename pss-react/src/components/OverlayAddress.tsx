import React from 'react'
import { beedebug } from '../default'

interface State {
    overlayAddress: string | null
    error: Error | null
    loading: boolean
}

export class OverlayAddress extends React.Component<{}, State> {
    constructor(props: {}) {
        super(props)

        this.state = {
            overlayAddress: null,
            error: null,
            loading: true
        }
    }

    async componentDidMount() {
        try {
            const overlayAddress = await beedebug.getOverlayAddress()
            this.setState({overlayAddress, loading: false})
        } catch(error) {
            this.setState({error, loading: false})
        }
    }

    render() {
        const {overlayAddress, error, loading } = this.state

        return (
            <div>
                {loading && <p><code>Loading...</code></p>}
                {overlayAddress && <p><code>My Swarm Address: {overlayAddress}</code></p>}
                {error && <p><code>{error.message}</code></p>}
            </div>
        )
    }
} 