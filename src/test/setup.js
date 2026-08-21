import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// jsdom does not implement scrollIntoView, so any component that keeps a view
// pinned to its latest item throws on mount without this.
Element.prototype.scrollIntoView = () => {};

afterEach(() => {
  cleanup();
});
