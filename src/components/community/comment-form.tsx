import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

interface CommentFormProps {
  action: (formData: FormData) => Promise<void>
  submitLabel?: string
  placeholder?: string
  fieldId?: string
}

export function CommentForm({
  action,
  submitLabel = "Comment",
  placeholder = "Write a comment",
  fieldId = "content",
}: CommentFormProps) {
  return (
    <form action={action} className="space-y-3">
      <div className="space-y-2">
        <Label className="sr-only" htmlFor={fieldId}>
          Comment
        </Label>
        <textarea
          id={fieldId}
          name="content"
          rows={4}
          className="min-h-24 w-full rounded-[20px] border border-black/10 bg-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-zinc-400 focus-visible:border-black/25 focus-visible:ring-2 focus-visible:ring-black/10"
          placeholder={placeholder}
        />
      </div>

      <Button type="submit" size="sm">
        <i className="fa-solid fa-reply" aria-hidden="true" />
        {submitLabel}
      </Button>
    </form>
  )
}
