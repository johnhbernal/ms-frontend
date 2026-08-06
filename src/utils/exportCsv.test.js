import { describe, it, expect, vi } from 'vitest';
import { downloadCsv } from './exportCsv';

describe('downloadCsv', () => {
  it('creates a downloadable CSV blob with BOM', () => {
    const createObjectURL = vi.fn(() => 'blob:mock');
    const revokeObjectURL = vi.fn();
    global.URL.createObjectURL = createObjectURL;
    global.URL.revokeObjectURL = revokeObjectURL;

    const click = vi.fn();
    const remove = vi.fn();
    vi.spyOn(document, 'createElement').mockImplementation((tag) => {
      if (tag === 'a') {
        return { href: '', download: '', rel: '', click, remove, style: {} };
      }
      return document.createElement.bind(document)(tag);
    });
    vi.spyOn(document.body, 'appendChild').mockImplementation(() => {});

    downloadCsv('t.csv', ['A', 'B'], [[1, 'x,y']]);

    expect(createObjectURL).toHaveBeenCalled();
    const blob = createObjectURL.mock.calls[0][0];
    expect(blob).toBeInstanceOf(Blob);
    expect(click).toHaveBeenCalled();
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:mock');
  });
});
