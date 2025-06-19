"use client"
export default function ImageGallery() {
  // 这里只是占位，后续可传入图片数据
  return (
    <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 px-6 py-6">
      {[1,2,3,4].map(i => (
        <div key={i} className="bg-zinc-700 rounded-lg overflow-hidden flex flex-col">
          <div className="h-40 bg-zinc-600" />
          <div className="flex justify-between p-2">
            <button className="text-xs text-white bg-orange-500 px-2 py-1 rounded">下载</button>
            <button className="text-xs text-white bg-zinc-500 px-2 py-1 rounded">收藏</button>
          </div>
        </div>
      ))}
    </div>
  )
} 