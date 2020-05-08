```js script
import { html } from '@open-wc/demoing-storybook';
import { withKnobs, withWebComponentsKnobs } from '@open-wc/demoing-storybook';

import '../dist/wc-dashboard.js';

export default {
  title: 'WcDashboard',
  component: 'wc-dashboard',
  decorators: [withKnobs, withWebComponentsKnobs],
  options: { selectedPanel: "storybookjs/knobs/panel" },
};
```

# WcDashboard

A component for adding drag and drop capacity to reorder a list of children.

## Features:

- a
- b
- ...

## How to use

### Installation

```bash
yarn add wc-dashboard
```

```js
import 'wc-dashboard/wc-dashboard.js';
```

```js preview-story
export const Simple = () => html`
  <wc-dashboard><div class="divRec">test 1</div>
<div class="divRec">test 2</div>
<div class="divRec">test 3</div>
</wc-dashboard>
`;
```

## Variations

###### Custom Title

```js preview-story
export const CustomTitle = () => html`
  <wc-dashboard gridColumns="3" gridRows="2"
                .elementConfiguration="${[{order: 3, col: 1, row: 2}, {order: 2, row: 3}, {order: 1, col: 2}]}">
<div class="divRec">test 1</div>
<div class="divRec"><div>test 2 with subelement</div><div class="divRec">test 2 with subelement</div></div>
<div class="divRec">test 3</div>
</wc-dashboard>
`;
```
