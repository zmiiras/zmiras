import * as LucideIcons from "lucide-react";
import type { LucideProps } from "lucide-react";

type IconComponent = React.ComponentType<LucideProps>;

const FALLBACK = LucideIcons.Sparkles as IconComponent;

/** "map-pin" | "map_pin" | "mapPin" | "MapPin" -> "MapPin" */
function toPascalCase(name: string) {
  return name
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join("");
}

export function resolveIcon(name?: string | null): IconComponent {
  if (!name || typeof name !== "string") return FALLBACK;
  const registry = LucideIcons as unknown as Record<string, unknown>;
  const candidates = [toPascalCase(name), name, `${toPascalCase(name)}Icon`];
  for (const key of candidates) {
    const found = registry[key];
    if (typeof found === "function" || (found && typeof found === "object")) {
      return found as IconComponent;
    }
  }
  return FALLBACK;
}

export function DynamicIcon({
  name,
  ...props
}: LucideProps & { name?: string | null }) {
  const Icon = resolveIcon(name);
  return <Icon {...props} />;
}
