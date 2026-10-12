import { Container } from "@/components/site";

export function CaseSubNav({ items }: { items: string[][] }) {
  return (
    <div className="sticky top-16 z-40 border-b border-white/5 bg-ink">
      <Container className="scrollbar-none flex gap-2 overflow-x-auto py-3">
        {items.map(([id, label]) => (
          <a key={id} href={`#${id}`} className="subnav-link">{label}</a>
        ))}
      </Container>
    </div>
  );
}
