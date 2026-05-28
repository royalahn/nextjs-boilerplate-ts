import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface AuthorAvatarProps {
  name: string | null
  image?: string | null
  size?: "sm" | "default" | "lg"
  className?: string
}

function getInitial(name: string | null) {
  return name?.charAt(0).toUpperCase() ?? "U"
}

export function AuthorAvatar({
  name,
  image,
  size = "default",
  className,
}: AuthorAvatarProps) {
  return (
    <Avatar size={size} className={className}>
      <AvatarImage src={image ?? undefined} alt={name ?? "User"} />
      <AvatarFallback>{getInitial(name)}</AvatarFallback>
    </Avatar>
  )
}
