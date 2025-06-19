'use client'

interface ImageCardProps {
  imageUrl: string
  imageId?: string
}

export default function ImageCard({ imageUrl, imageId }: ImageCardProps) {
  const handleFavorite = async () => {
    // For MVP, just show a message. In future, this would save to database
    alert('收藏功能将在未来版本中实现')
  }

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = imageUrl
    link.download = `ai-generated-image-${imageId || Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="relative rounded-lg overflow-hidden bg-zinc-800 group">
      <img 
        src={imageUrl} 
        alt="AI Generated Image"
        className="w-full h-auto transition-transform group-hover:scale-105" 
      />
      <div className="absolute bottom-2 left-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <button 
        onClick={handleFavorite}
          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full flex-1"
        >
          ❤️
        </button>
        <button 
          onClick={handleDownload}
          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full flex-1"
      >
          ⬇️
      </button>
      </div>
    </div>
  )
}