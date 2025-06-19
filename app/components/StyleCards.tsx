"use client"
export default function StyleCards() {
  // 这里只是占位，后续可传入风格数据
  return (
    <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 px-6 py-4">
      {[1,2,3,4].map(i => (
        <div key={i} className="bg-zinc-700 rounded-lg p-4 flex flex-col items-center">
          <div className="w-20 h-20 bg-zinc-600 rounded mb-2" />
          <div className="text-white font-medium">风格名称</div>
          <div className="text-xs text-gray-400 mt-1">风格简介</div>
        </div>
      ))}
    </div>
  )
} 