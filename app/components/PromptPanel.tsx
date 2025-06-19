"use client"
import SmartInput from './SmartInput'

export default function PromptPanel() {
  return (
    <div className="w-full flex flex-col md:flex-row gap-4 px-6 py-4 items-center">
      <SmartInput
        as="textarea"
        className="flex-1 h-24 bg-zinc-700 text-white rounded-lg p-4 border border-zinc-600 focus:ring-2 focus:ring-orange-500"
      />
      <div className="flex flex-col gap-2">
        <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded">生成</button>
        {/* 这里可加参数调节按钮 */}
      </div>
    </div>
  )
} 