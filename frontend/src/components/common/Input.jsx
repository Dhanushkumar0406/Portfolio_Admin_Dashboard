import { forwardRef } from 'react'
import clsx from 'clsx'

const Input = forwardRef(({
  label,
  type = 'text',
  error,
  icon,
  className = '',
  ...props
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-soft mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-soft">{icon}</span>
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={clsx(
          'w-full px-4 py-3 bg-ink-100 border border-white/10 rounded-lg',
            'text-white placeholder:text-slate-100/40',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
            'transition-all duration-300',
            icon && 'pl-10',
            error && 'border-red-500 focus:ring-red-500',
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input
