export function readFile(event: Event): Promise<string | null> {
  return new Promise((resolve, reject) => {
    const target = event.target as HTMLInputElement;
    const { files } = target;
    if (!files) return;
    const reader = new FileReader();
    const file = files[0];

    reader.onload = () => resolve(reader.result as string | null);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}
