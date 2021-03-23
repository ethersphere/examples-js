import React from 'react'
import { PssMessageHandler, PssSubscription } from '@ethersphere/bee-js'
import { bee } from '../default'

interface State {
    subscription: PssSubscription | null
    error: Error | null
    messages: string[]
}

export class MessageHistory extends React.Component<{}, State> {
    constructor(props: {}) {
        super(props)

        this.state = {
            subscription: null,
            error: null,
            messages: []
        }
    }

    componentDidMount() {
        try {
            const handler: PssMessageHandler = {
                onError: (error: Error) => this.setState({error}),
                onMessage: (message: Uint8Array) => {
                    const m = new TextDecoder("utf-8").decode(message)
                    this.setState((prevState: State) => ({ messages: [...prevState.messages, m] }))
                }
            }
            const subscription = bee.pssSubscribe('topic', handler)
            this.setState({subscription})
        } catch(error) {
            this.setState({error})
        }
    }

    componentWillUnmount() {
        this.state.subscription?.cancel()

    }

    render() {
        const { error, messages } = this.state
        return (
            <div>
                { error && <code>{error.message}</code>}
                { messages.map((m, i) => <p key={i}>{m}</p>) }
            </div>
        )
    }
}