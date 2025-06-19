"use client"
import { useRef, useState, useEffect } from 'react'

type SmartInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  as?: 'input'
  prefixText?: string
}

type SmartTextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  as: 'textarea'
  prefixText?: string
}

type Props = SmartInputProps | SmartTextareaProps

export default function SmartInput(props: Props) {
  const { as = 'input', className = '', value = '', onChange, prefixText = '', ...rest } = props
  const ref = useRef<any>(null)
  const [localValue, setLocalValue] = useState(value)

  // 同步外部 value
  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const prefixRef = useRef<HTMLSpanElement>(null)

  const handleChange = (e: any) => {
    setLocalValue(e.target.value)
    if (onChange) onChange(e)
  }

  // 基础样式：小号字体，灰色提示文字
  const baseClass = `${className} text-sm placeholder:text-gray-400`;

  if (as === 'textarea') {
    return (
      <div className="relative flex items-center">
        {prefixText && !localValue && (
          <span
            ref={prefixRef}
            className="absolute left-4 top-[12px] text-gray-400 select-none pointer-events-none text-sm font-light whitespace-pre-wrap break-words pr-3"
            style={{ 
              zIndex: 1, 
              lineHeight: 1.4,
              maxWidth: 'calc(100% - 32px)',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              MozUserSelect: 'none',
              msUserSelect: 'none'
            }}
          >
            {prefixText}
          </span>
        )}
        <textarea
          ref={ref}
          className={baseClass + ' w-full'}
          value={localValue}
          onChange={handleChange}
          {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      </div>
    )
  }

  return (
    <div className="relative flex items-center">
      {prefixText && !localValue && (
        <span
          ref={prefixRef}
          className="absolute left-3 text-gray-400 select-none pointer-events-none text-sm whitespace-pre"
          style={{ 
            zIndex: 2,
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none'
          }}
        >
          {prefixText}
        </span>
      )}
      <input
        ref={ref}
        className={baseClass + ' w-full'}
        value={localValue}
        onChange={handleChange}
        {...(rest as React.InputHTMLAttributes<HTMLInputElement>)}
      />
    </div>
  )
} 