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
          className="min-h-24 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          placeholder={placeholder}
        />
      </div>

      <Button type="submit" size="sm">
        {submitLabel}
      </Button>
    </form>
  )
}
