"use client"
const tabs = ['全部', '人像', '动漫', '插画', '3D', '摄影', '其他']
export default function StyleTabs() {
  return (
    <div className="w-full flex gap-2 px-6 py-3 bg-zinc-800">
      {tabs.map(tab => (
        <button key={tab} className="px-4 py-1 rounded-full text-sm font-medium text-white bg-zinc-700 hover:bg-orange-500 transition">{tab}</button>
      ))}
    </div>
  )
} 