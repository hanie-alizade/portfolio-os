const NOTES = [
  "Ship something cool",
  "Make users smile",
  "Drink more coffee",
  "Repeat ☕",
] as const;

export function StickyNoteWindowContent() {
  return (
    <div className="os-sticky">
      <p className="os-sticky__title">Note to Self</p>
      <ul>
        {NOTES.map((note) => (
          <li key={note}>{note}</li>
        ))}
      </ul>
    </div>
  );
}
