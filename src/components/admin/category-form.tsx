import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface CategoryFormProps {
  action: (formData: FormData) => Promise<void>
  submitLabel?: string
  defaultName?: string
  defaultSlug?: string
  defaultSortOrder?: number
  fieldPrefix?: string
}

export function CategoryForm({
  action,
  submitLabel = "Save category",
  defaultName = "",
  defaultSlug = "",
  defaultSortOrder = 0,
  fieldPrefix = "",
}: CategoryFormProps) {
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
        <Label htmlFor={`${prefix}sortOrder`}>Sort order</Label>
        <Input
          id={`${prefix}sortOrder`}
          name="sortOrder"
          type="number"
          defaultValue={defaultSortOrder}
        />
      </div>
      <Button type="submit">
        <i className="fa-solid fa-layer-group" aria-hidden="true" />
        {submitLabel}
      </Button>
    </form>
  )
}
