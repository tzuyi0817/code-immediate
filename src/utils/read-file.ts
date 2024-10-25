export function readFile(event: Event) {
  const target = event.target as HTMLInputElement;
  const { files } = target;

  if (!files || !files.length) return;
  const file = files[0];

  return file.text();
}
