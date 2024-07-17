import React, { useEffect, useState } from "react"
import "xgplayer/dist/index.min.css"
import Player from "xgplayer"
import HlsPlugin from "xgplayer-hls"

const XGPlayer: React.FC = () => {
  const [url, setUrl] = useState<string>("")
  const [videoUrl, setVideoUrl] = useState<string>("")

  useEffect(() => {
    let player: Player | null = null

    if (videoUrl) {
      if (document.createElement("video").canPlayType("application/vnd.apple.mpegurl")) {
        // 移动端直接原生支持
        player = new Player({
          id: "xgplayer",
          url: videoUrl,
        })
      } else if (HlsPlugin.isSupported()) {
        // 支持 HLS 插件
        player = new Player({
          id: "xgplayer",
          playsinline: true,
          url: videoUrl,
          autoplay: false,
          fluid: false,
          playbackRate: [0.5, 1, 1.5, 2],
          screenShot: true,
          download: true,
          plugins: [HlsPlugin],
        })
      }

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
    <div className="p-6 max-w-full mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h1 className="text-2xl font-bold text-center mb-4">西瓜播放器</h1>
      <div className="mb-8 flex w-full justify-between">
        <input
          type="text"
          className="border border-gray-300 p-2 w-5/6 rounded-md"
          placeholder="请输入 m3u8 视频地址"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <button onClick={handlePlay} className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700">
          确定
        </button>
      </div>

      <div id="xgplayer" className="w-full h-64 bg-black mt-4"></div>
    </div>
  )
}

export default XGPlayer
