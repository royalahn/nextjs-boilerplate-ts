import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface BoardFormProps {
  action: (formData: FormData) => Promise<void>
  submitLabel?: string
  defaultName?: string
  defaultSlug?: string
  defaultDescription?: string | null
  fieldPrefix?: string
}

export function BoardForm({
  action,
  submitLabel = "Save board",
  defaultName = "",
  defaultSlug = "",
  defaultDescription = "",
  fieldPrefix = "",
}: BoardFormProps) {
  const prefix = fieldPrefix ? `${fieldPrefix}-` : ""

  return (
    <form action={action} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor={`${prefix}name`}>Name</Label>
        <Input id={`${prefix}name`} name="name" defaultValue={defaultName} />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${prefix}slug`}>Slug</Label>
        <Input id={`${prefix}slug`} name="slug" defaultValue={defaultSlug} />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${prefix}description`}>Description</Label>
        <textarea
          id={`${prefix}description`}
          name="description"
          rows={4}
          defaultValue={defaultDescription ?? ""}
          className="min-h-24 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>
      <Button type="submit">
        <i className="fa-solid fa-floppy-disk" aria-hidden="true" />
        {submitLabel}
      </Button>
    </form>
  )
}
