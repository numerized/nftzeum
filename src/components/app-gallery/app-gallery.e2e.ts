import { newE2EPage } from '@stencil/core/testing';

describe('app-gallery', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<app-gallery></app-gallery>');
    const element = await page.find('app-gallery');
    expect(element).toHaveClass('hydrated');
  });{cursor}
});
