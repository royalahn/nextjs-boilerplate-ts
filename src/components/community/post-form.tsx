import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface PostFormProps {
  action: (formData: FormData) => Promise<void>
  submitLabel?: string
}

export function PostForm({
  action,
  submitLabel = "Publish post",
}: PostFormProps) {
  return (
    <form action={action} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" placeholder="Write a clear title" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <textarea
          id="content"
          name="content"
          rows={10}
          className="min-h-40 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          placeholder="Share your post"
        />
      </div>

      <p className="rounded-lg border border-dashed px-3 py-2 text-xs text-muted-foreground">
        Image attachments are planned, but upload support is not wired up yet.
      </p>

      <Button type="submit">{submitLabel}</Button>
    </form>
  )
}
