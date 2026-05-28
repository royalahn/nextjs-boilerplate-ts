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
        {liked ? "Unlike" : "Like"} {label} ({count})
      </Button>
    </form>
  )
}
