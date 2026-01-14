import React, { useEffect, useState, useCallback } from "react"
import "xgplayer/dist/index.min.css"
import Player from "xgplayer"
import HlsPlugin from "xgplayer-hls"

const M3u8Player: React.FC = () => {
  const [url, setUrl] = useState<string>("")
  const [videoUrl, setVideoUrl] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>("")

  // 使用 useCallback 优化函数性能
  const handlePlay = useCallback(() => {
    if (!url.trim()) {
      setError("请输入有效的 m3u8 视频地址")
      return
    }
    setVideoUrl(url)
  }, [url])

  const handleExampleClick = useCallback(() => {
    const exampleUrl = "https://sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/hls/xgplayer-demo.m3u8"
    setUrl(exampleUrl)
    setVideoUrl(exampleUrl)
  }, [])

  useEffect(() => {
    let player: Player | null = null
    setError("")

    if (videoUrl) {
      setLoading(true)

      try {
        const playerOptions = {
          id: "m3u8player",
          url: videoUrl,
          playsinline: true,
          fluid: true,
          autoplay: false,
          playbackRate: [0.5, 1, 1.5, 2],
          screenShot: true,
          download: true,
          lang: "zh-cn",
          volume: 0.7,
          cssFullscreen: true,
          controls: true,
          preload: "metadata",
          poster: "",
          defaultPlaybackRate: 1,
        }

        if (document.createElement("video").canPlayType("application/vnd.apple.mpegurl")) {
          // 移动端直接原生支持
          player = new Player(playerOptions)
        } else if (HlsPlugin.isSupported()) {
          // 支持 HLS 插件
          player = new Player({
            ...playerOptions,
            plugins: [HlsPlugin],
          })
        } else {
          throw new Error("当前浏览器不支持 HLS 视频播放")
        }

        // 添加错误监听
        player.on("error", (err) => {
          console.error("播放器错误:", err)
          setError("视频播放失败，请检查视频地址是否正确")
        })

        player.on("ready", () => {
          setLoading(false)
        })

        player.on("waiting", () => {
          setLoading(true)
        })

        player.on("playing", () => {
          setLoading(false)
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : "视频初始化失败")
        setLoading(false)
      }

      return () => {
        if (player) {
          player.destroy()
        }
        setLoading(false)
      }
    }
  }, [videoUrl])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-4 px-4 md:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto w-full">
        {/* 卡片容器 */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
          {/* 头部渐变背景 */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-5 px-6 sm:px-8">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white text-center leading-tight">
              M3U8 播放器
            </h1>
            <p className="text-blue-100 text-center mt-1 text-sm sm:text-base">流畅播放 m3u8 视频，支持多设备兼容</p>
          </div>

          {/* 内容区域 */}
          <div className="p-4 sm:p-6 md:p-8 space-y-5">
            {/* 输入和按钮区域 */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  className="border border-slate-200 p-3 flex-1 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-slate-400 bg-slate-50 hover:bg-white"
                  placeholder="请输入 m3u8 视频地址，例如：https://sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/hls/xgplayer-demo.m3u8"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />

                <div className="flex flex-col sm:flex-row gap-3 min-w-[160px] sm:min-w-auto">
                  <button
                    onClick={handleExampleClick}
                    className="bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 py-3 px-5 rounded-lg hover:from-slate-200 hover:to-slate-300 whitespace-nowrap text-sm sm:text-base font-medium transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 active:translate-y-0">
                    使用示例
                  </button>
                  <button
                    onClick={handlePlay}
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 px-5 rounded-lg hover:from-blue-600 hover:to-indigo-600 whitespace-nowrap text-sm sm:text-base font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2">
                    播放
                  </button>
                </div>
              </div>
            </div>

            {/* 错误信息 */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-3 rounded-lg flex items-center gap-2 shadow-sm transition-all duration-300 animate-fadeIn">
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* 播放器容器 */}
            <div className="relative group">
              {/* 加载状态 */}
              {loading && (
                <div className="absolute inset-0 bg-black/90 flex items-center justify-center z-10 rounded-xl transition-all duration-300 animate-fadeIn">
                  <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-3"></div>
                    <div className="text-white text-lg font-medium">加载中...</div>
                  </div>
                </div>
              )}

              {/* 播放器 */}
              <div
                id="m3u8player"
                className="w-full aspect-[16/9] bg-slate-900 rounded-xl overflow-hidden shadow-lg transition-all duration-300 group-hover:shadow-xl"></div>
            </div>

            {/* 提示信息 */}
            <div className="text-xs text-slate-500 text-center pt-1 transition-all duration-300 animate-fadeIn">
              支持桌面和移动设备播放 m3u8 格式视频 • 支持倍速播放 • 支持截图下载
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default M3u8Player
