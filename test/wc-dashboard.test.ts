import { html, fixture, expect } from '@open-wc/testing';

import {WcDashboard} from '../src/WcDashboard.js';
import '../wc-dashboard.js';

describe('WcDashboard', () => {
  it('has a default title "Hey there" and counter 5', async () => {
    const el: WcDashboard = await fixture(html`
      <wc-dashboard></wc-dashboard>
    `);

    expect(el.title).to.equal('Hey there');
    expect(el.counter).to.equal(5);
  });

  it('increases the counter on button click', async () => {
    const el: WcDashboard = await fixture(html`
      <wc-dashboard></wc-dashboard>
    `);
    el.shadowRoot!.querySelector('button')!.click();

    expect(el.counter).to.equal(6);
  });

  it('can override the title via attribute', async () => {
    const el: WcDashboard = await fixture(html`
      <wc-dashboard title="attribute title"></wc-dashboard>
    `);

    expect(el.title).to.equal('attribute title');
  });

  it('passes the a11y audit', async () => {
    const el: WcDashboard = await fixture(html`
      <wc-dashboard></wc-dashboard>
    `);

    await expect(el).shadowDom.to.be.accessible();
  });
});
