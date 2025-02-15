'use client'
import { useState } from 'react'

export default function Home() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [downloadInfo, setDownloadInfo] = useState<{
    title: string;
    url: string;
  } | null>(null)

  const handleDownload = async () => {
    try {
      setLoading(true)
      setDownloadInfo(null)
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/get-download-link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.detail || 'Download failed')
      }

      const data = await res.json()
      setDownloadInfo(data)

    } catch (error) {
      alert('error');
      console.error(error);
    } finally {
      setLoading(false)
    }
  }

  const initiateDownload = () => {
    if (!downloadInfo) return;

    // Create the download URL with query parameters
    const downloadUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/download?url=${encodeURIComponent(downloadInfo.url)}&title=${encodeURIComponent(downloadInfo.title)}`;

    // Create a hidden link and click it
    const link = document.createElement('a');
    link.href = downloadUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
        {loading ? 'Processing...' : 'Get Video'}
      </button>

      {downloadInfo && (
        <div className="download-info">
          <h3>{downloadInfo.title}</h3>
          <div className="button-group">
            <button onClick={initiateDownload} className="download-button">
              Download Video
            </button>
            <a href={downloadInfo.url} target='_blank' className="download-button">
              Preview Video
            </a>
          </div>
        </div>
      )}
    </div>
  )
}