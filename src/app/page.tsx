'use client'
import { useState } from 'react'

export default function Home() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)

  const handleDownload = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/get-download-link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.detail || 'Download failed')
      }

    } catch (error) {
      alert('error');
      console.error(error);
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <h1>Free Video Downloader</h1>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Paste video URL here"
      />
      <button onClick={handleDownload} disabled={loading}>
        {loading ? 'Processing...' : 'Download'}
      </button>
    </div>
  )
}