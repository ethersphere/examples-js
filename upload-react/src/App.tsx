import React, { useState } from 'react';
import { Bee } from '@ethersphere/bee-js';
import './App.css';

const beeUrl = "https://gateway.ethswarm.org"
const bee = new Bee(beeUrl);

function App() {
  const [ file, setFile ] = useState<File | null>(null)
  const [ link, setLink ] = useState<string | null>(null)
  const [ uploading, setUploading ] = useState(false)
  const [ error, setError ] = useState<Error | null>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>)=> {
    event.preventDefault();

    if (file) {
      try {
      setUploading(true)
      setLink(null)

      const hash = await bee.uploadFile(file)
      setLink(`${beeUrl}/files/${hash}`)
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
      <h1>Upload file to Swarm</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" name="file" onChange={onFileChange} />
        <input type="submit" disabled={!file} />
      </form>
      <br />
      <code>
        { uploading && <span>Uploading...</span> }
        { link && <a href={link} target="blank" >{link}</a> }
        { error && <span>{error.message}</span> }
      </code>
    </div>
  );
}

export default App;