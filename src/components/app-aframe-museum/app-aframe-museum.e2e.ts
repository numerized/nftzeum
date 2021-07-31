import { newE2EPage } from '@stencil/core/testing';

describe('app-aframe-museum', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<app-aframe-museum></app-aframe-museum>');
    const element = await page.find('app-aframe-museum');
    expect(element).toHaveClass('hydrated');
  });{cursor}
});
