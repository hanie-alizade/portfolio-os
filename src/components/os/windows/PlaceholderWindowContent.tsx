export function PlaceholderWindowContent({ title }: { title: string }) {
  return (
    <div className="flex h-full flex-col gap-2 p-4">
      <p className="text-os-sm text-os-text-muted">
        <span className="font-medium text-os-text">{title}</span> opens from the
        Dock.
      </p>
      <p className="text-os-xs leading-relaxed text-os-text-subtle">
        Full content for this app arrives in a later step.
      </p>
    </div>
  );
}
