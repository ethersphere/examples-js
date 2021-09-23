import React, { useState, useEffect } from 'react';
import { Address, Bee, PostageBatch } from '@ethersphere/bee-js';
import './App.css';

const beeUrl = "http://localhost:1633"
const POSTAGE_STAMPS_AMOUNT = BigInt(10000)
const POSTAGE_STAMPS_DEPTH = 20
const bee = new Bee(beeUrl);

function App() {
  const [ file, setFile ] = useState<File | null>(null)
  const [ link, setLink ] = useState<string | null>(null)
  const [ uploading, setUploading ] = useState(false)
  const [ error, setError ] = useState<Error | null>(null)

  const [ postageStamps, setPostageStamps ] = useState<PostageBatch[]>([])
  const [ selectedPostageStamp, setSelectedPostageStamp ] = useState<Address | null>(null)
  const [ loadingStamps, setLoadingStamps ] = useState<boolean>(false)
  const [ creatingStamp, setCreatingStamp ] = useState<boolean>(false)
  const [ stampError, setStampError ] = useState<Error | null>(null)

  useEffect(() => {
    setLoadingStamps(true)
    bee.getAllPostageBatch()
      .then((ps: PostageBatch[]) => setPostageStamps(ps))
      .catch(setStampError)
      .finally(() => setLoadingStamps(false))
  }, [])

  const createPostageStamp = async () => {
    try {
      setCreatingStamp(true)
      await bee.createPostageBatch(POSTAGE_STAMPS_AMOUNT.toString(), POSTAGE_STAMPS_DEPTH)
      setCreatingStamp(false)

      setLoadingStamps(true)
      const ps = await bee.getAllPostageBatch()
      setPostageStamps(ps)
      setLoadingStamps(false)
    }
    catch(e) {
      setStampError(e)
    }
  }

  const handleSelectPostageStamp = (event: React.ChangeEvent<HTMLInputElement>) => {setSelectedPostageStamp(event.target.value as Address)}

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedPostageStamp) return

    if (file) {
      try {
        setUploading(true)
        setLink(null)

        const { reference } = await bee.uploadFile(selectedPostageStamp, file)
        setLink(`${beeUrl}/bzz/${reference}`)
      } catch (e) {
        setError(e)
      }
      finally {
        setUploading(false)
      }
    }
  }

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const f = event.target && event.target.files && event.target.files[0]

    setFile(f)
    setError(null)
    setLink(null)
  }

  return (
    <div className="App">
      <h1>Postage stamps</h1>
      <code>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '100px 1fr 100px',
          rowGap: '5px',
          columnGap: '15px'
        }}>
          <div>Selected</div>
          <div>Batch ID</div>
          <div>Utilization</div>
        </div>
        <hr />
        {postageStamps.map(({batchID, utilization}) =>
        <div key={batchID} style={{
          display: 'grid',
          gridTemplateColumns: '100px 1fr 100px',
          rowGap: '5px',
          columnGap: '15px'
        }}>
          <div><input type="radio" name="stamps" value={batchID} onChange={handleSelectPostageStamp} /></div>
          <div>{batchID}</div>
          <div>{utilization}</div>
        </div>)}
        <hr />
      </code>
      <button onClick={createPostageStamp}>Create new postage stamp</button>
      <code>
        { loadingStamps && <span>Loading postage stamps...</span> }
        { creatingStamp && <span>Creating new postage stamp...</span> }
        { stampError && <span>{stampError.message}</span> }
      </code>

      <h1>Upload file to Swarm</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" name="file" onChange={onFileChange} />
        <input type="submit" disabled={!file || selectedPostageStamp === null} />
      </form>
      <br />
      <code>
        { selectedPostageStamp === null && <span>Please select a postage stamp to use for the file upload</span>}
        { uploading && <span>Uploading...</span> }
        { link && <a href={link} target="blank" >{link}</a> }
        { error && <span>{error.message}</span> }
      </code>
    </div>
  );
}

export default App;
