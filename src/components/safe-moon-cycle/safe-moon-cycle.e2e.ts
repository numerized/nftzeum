import { newE2EPage } from '@stencil/core/testing';

describe('safe-moon-cycle', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<safe-moon-cycle></safe-moon-cycle>');
    const element = await page.find('safe-moon-cycle');
    expect(element).toHaveClass('hydrated');
  });{cursor}
});
