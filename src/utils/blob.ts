type BlobURLType = 'render';

const blobURLMap = new Map<BlobURLType, string>();

export function getBlobURL(jsCode: string, type: BlobURLType) {
  const blob = new Blob([jsCode], { type: 'text/javascript' });
  const blobURL = URL.createObjectURL(blob);

  blobURLMap.set(type, blobURL);
  return blobURL;
}

export function revokeBlobURL() {
  blobURLMap.forEach(blobURL => URL.revokeObjectURL(blobURL));
}
