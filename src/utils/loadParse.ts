import loadjs from 'loadjs';

const loadedParseMap = new Map([
  ['html', true],
  ['css', true],
  ['javascript', true],
]);

export function loadParse(language: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (loadedParseMap.get(language)) return resolve();
    const resource = `parses/${language}.js`;

    loadjs(resource, { returnPromise: true })
      .then(() => {
        loadedParseMap.set(language, true);
        resolve();
      })
      .catch((error: Error) => reject(error));
  });
}
