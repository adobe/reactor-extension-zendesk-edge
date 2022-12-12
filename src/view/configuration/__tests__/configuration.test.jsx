/*
Copyright 2022 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND,  either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

/* eslint-disable no-template-curly-in-string */

import { screen } from '@testing-library/react';
import renderView from '../../__tests_helpers__/renderView';
import { changeInputValue } from '../../__tests_helpers__/jsDomHelpers';

import Configuration from '../configuration';
import createExtensionBridge from '../../__tests_helpers__/createExtensionBridge';

let extensionBridge;

beforeEach(() => {
  extensionBridge = createExtensionBridge();
  window.extensionBridge = extensionBridge;
});

afterEach(() => {
  delete window.extensionBridge;
});

const getFromFields = () => ({
  domainField: screen.getByLabelText(/Domain/i),
  tokenField: screen.getByLabelText(/Access Token/i, {
    selector: '[name="token"]'
  })
});

describe('Configuration', () => {
  test('sets form values from setting', async () => {
    renderView(Configuration);

    extensionBridge.init({
      settings: {
        domain: 'subdomain.zendesk.com',
        token: '123abc'
      }
    });

    const { domainField, tokenField } = getFromFields();

    expect(domainField.value).toBe('subdomain.zendesk.com');
    expect(tokenField.value).toBe('123abc');
  });

  test('sets settings from form values', async () => {
    renderView(Configuration);

    extensionBridge.init({
      settings: {
        domain: 'subdomain.zendesk.com',
        token: '123abc'
      }
    });

    const { domainField, tokenField } = getFromFields();
    await changeInputValue(domainField, 'newsubdomain.zendesk.com');
    await changeInputValue(tokenField, 'new123abc');

    expect(extensionBridge.getSettings()).toEqual({
      domain: 'newsubdomain.zendesk.com',
      token: 'new123abc'
    });
  });

  test('handles form validation correctly', async () => {
    renderView(Configuration);

    extensionBridge.init({
      settings: {
        domain: 'subdomain.zendesk.com',
        token: '123abc'
      }
    });

    const { domainField, tokenField } = getFromFields();

    expect(domainField).not.toHaveAttribute('aria-invalid', 'true');
    await changeInputValue(domainField, '');

    expect(tokenField).not.toHaveAttribute('aria-invalid', 'true');
    await changeInputValue(tokenField, '');

    await extensionBridge.validate();

    expect(domainField).toHaveAttribute('aria-invalid', 'true');
    expect(tokenField).toHaveAttribute('aria-invalid', 'true');
  });
});
