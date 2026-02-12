import { motion } from 'framer-motion'
import clsx from 'clsx'

const Card = ({
  children,
  className = '',
  hover = true,
  gradient = false,
  onClick,
  ...props
}) => {
  const baseStyles = 'glass-card p-6 rounded-xl'

  const hoverStyles = hover ? 'hover:scale-105 hover:shadow-xl hover:shadow-primary/20 cursor-pointer' : ''

  const gradientStyles = gradient ? 'bg-gradient-card border-2 border-transparent bg-clip-padding' : ''

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={hover ? { y: -5 } : {}}
      onClick={onClick}
      className={clsx(
        baseStyles,
        hoverStyles,
        gradientStyles,
        'transition-all duration-300',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export default Card
