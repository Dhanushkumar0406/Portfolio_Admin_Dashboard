const Loader = ({ size = 'md', text = 'Loading...' }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative">
        <div className={`${sizes[size]} border-4 border-primary/20 rounded-full`}></div>
        <div className={`${sizes[size]} border-4 border-primary border-t-transparent rounded-full animate-spin absolute top-0 left-0`}></div>
      </div>
      {text && <p className="mt-4 text-soft">{text}</p>}
    </div>
  )
}

export default Loader
