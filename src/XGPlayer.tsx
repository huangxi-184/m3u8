import React, { useEffect, useRef, useState } from "react"
import "xgplayer/dist/xgplayer.min.css"
import HlsJsPlayer from "xgplayer-hls.js"

const XGPlayer: React.FC = () => {
  const playerRef = useRef<HTMLDivElement | null>(null)
  const [url, setUrl] = useState<string>("")
  const [videoUrl, setVideoUrl] = useState<string>("")

  useEffect(() => {
    let player: HlsJsPlayer | null = null

    if (videoUrl && playerRef.current) {
      player = new HlsJsPlayer({
        id: playerRef.current,
        url: videoUrl,
        width: 600,
        height: 400,
        autoplay: true,
        controls: true,
      })

      // Ensure player is properly destroyed on component unmount
      return () => {
        if (player) {
          player.destroy()
        }
      }
    }
  }, [videoUrl])

  const handlePlay = () => {
    setVideoUrl(url)
  }

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h1 className="text-2xl font-bold text-center mb-4">西瓜播放器 Demo</h1>
      <div className="mb-4">
        <input
          type="text"
          className="border border-gray-300 p-2 w-full rounded-md"
          placeholder="请输入 m3u8 视频地址"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </div>
      <button onClick={handlePlay} className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700">
        确定
      </button>
      <div ref={playerRef} className="w-full h-64 bg-black mt-4"></div>
    </div>
  )
}

export default XGPlayer
