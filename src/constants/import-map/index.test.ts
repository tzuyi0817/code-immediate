import { IMPORT_MAP, IMPORT_MAP_BUILD_IN_SOURCES } from '@/constants/import-map';
import { VERSION } from '@/constants/template';

const localLibraries = Object.keys(import.meta.glob('/public/lib/**/*.{js,mjs}'));

describe('IMPORT_MAP', () => {
  it('resolves react/jsx-runtime for packages built with the automatic jsx runtime', () => {
    expect(IMPORT_MAP.React.imports['react/jsx-runtime']).toBe(`./lib/react@${VERSION.REACT}/jsx-runtime.mjs`);
    expect(IMPORT_MAP_BUILD_IN_SOURCES.has('react/jsx-runtime')).toBe(true);
  });

  it('ships every local library file referenced by the import map', () => {
    const localSources = Object.values(IMPORT_MAP)
      .flatMap(template => Object.values(template?.imports ?? {}))
      .filter(source => source.startsWith('./lib/'));

    expect(localSources.length).toBeGreaterThan(0);

    for (const source of localSources) {
      expect(localLibraries).toContain(source.replace('./', '/public/'));
    }
  });
});
