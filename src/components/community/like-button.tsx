import { Button } from "@/components/ui/button"

interface LikeButtonProps {
  action: (formData: FormData) => Promise<void>
  liked: boolean
  count: number
  label: string
}

export function LikeButton({ action, liked, count, label }: LikeButtonProps) {
  return (
    <form action={action}>
      <Button type="submit" variant={liked ? "secondary" : "outline"} size="sm">
        <i
          className={`fa-${liked ? "solid" : "regular"} fa-heart text-[0.85rem]`}
          aria-hidden="true"
        />
        <span>
          {liked ? "Unlike" : "Like"} {label}
        </span>
        <span className="font-mono text-xs text-black/60">({count})</span>
      </Button>
    </form>
  )
}
