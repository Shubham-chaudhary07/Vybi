export function QrPattern() {
  const cells = Array.from({ length: 81 }, (_, index) => {
    const x = index % 9;
    const y = Math.floor(index / 9);
    const finder = (x < 3 && y < 3) || (x > 5 && y < 3) || (x < 3 && y > 5);
    return finder
      ? (x === 1 && y === 1) ||
          (x === 7 && y === 1) ||
          (x === 1 && y === 7) ||
          x === 0 ||
          y === 0 ||
          x === 2 ||
          y === 2 ||
          x === 6 ||
          y === 6 ||
          x === 8 ||
          y === 8
      : (index * 7 + x * 3 + y) % 5 < 2;
  });

  return (
    <div aria-label="Ticket QR code" className="grid size-36 grid-cols-9 gap-1 bg-background p-2">
      {cells.map((filled, index) => (
        <span key={index} className={filled ? "bg-foreground" : "bg-background"} />
      ))}
    </div>
  );
}
