import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-teal-900/40 text-teal-300 border-teal-700/40',
        accent: 'bg-teal-600/20 text-teal-200 border-teal-500/50',
        muted: 'bg-white/5 text-text/60 border-white/10',
        light: 'bg-teal-50 text-teal-700 border-teal-100',
        amber: 'bg-amber-50 text-amber-700 border-amber-100',
        gray: 'bg-gray-100 text-gray-600 border-gray-200',
      },
    },
    defaultVariants: { variant: 'default' },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}
