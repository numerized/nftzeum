import { newE2EPage } from '@stencil/core/testing';

describe('app-island', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<app-island></app-island>');
    const element = await page.find('app-island');
    expect(element).toHaveClass('hydrated');
  });{cursor}
});
