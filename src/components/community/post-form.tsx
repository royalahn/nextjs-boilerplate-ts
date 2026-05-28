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
        <Label htmlFor="title" className="text-sm font-medium">
          Title
        </Label>
        <Input id="title" name="title" placeholder="Write a clear title" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content" className="text-sm font-medium">
          Content
        </Label>
        <textarea
          id="content"
          name="content"
          rows={10}
          className="min-h-40 w-full rounded-[20px] border border-black/10 bg-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-zinc-400 focus-visible:border-black/25 focus-visible:ring-2 focus-visible:ring-black/10"
          placeholder="Share your post"
        />
      </div>

      <p className="rounded-[20px] border border-dashed border-black/10 bg-black/[0.02] px-4 py-3 text-xs text-muted-foreground">
        Image attachments are planned, but upload support is not wired up yet.
      </p>

      <Button type="submit">{submitLabel}</Button>
    </form>
  )
}
