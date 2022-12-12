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
import {
  changeInputValue,
  getTextFieldByLabel,
  click
} from '../../__tests_helpers__/jsDomHelpers';

import CreateEvent from '../createEvent';
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
  eventSourceField: screen.queryByLabelText(/Source/i, {
    selector: '[name="event.source"]'
  }),
  eventTypeField: screen.queryByLabelText(/Type/i, {
    selector: '[name="event.type"]'
  }),
  eventDescriptionField: screen.queryByLabelText(/Description/i),
  eventCreatedAtField: screen.queryByLabelText(/Created At/i),
  profileSourceField: screen.queryByLabelText(/Source/i, {
    selector: '[name="profile.source"]'
  }),
  profileTypeField: screen.queryByLabelText(/Type/i, {
    selector: '[name="profile.type"]'
  }),
  profileNameField: screen.queryByLabelText(/Name/i),
  profileUserIdField: screen.queryByLabelText(/User ID/i),
  rawEventField: screen.queryByLabelText(/Event/i, {
    selector: 'textarea[name="rawEvent"]'
  })
});

describe('Create Event', () => {
  describe('form view', () => {
    test('sets form values from setting', async () => {
      renderView(CreateEvent);

      extensionBridge.init({
        settings: {
          zendeskEvent: {
            event: {
              source: 'fb',
              type: 'web',
              description: 'event description',
              created_at: '2012-03-02T04:07:34.0218628Z',
              properties: {
                passcode_preference: 'SMS'
              }
            },
            profile: {
              source: 'acme',
              type: 'customer',
              name: 'John Doe',
              user_id: '1234',
              identifiers: [
                {
                  type: 'email',
                  value: 'jdoe@example.com'
                },
                {
                  type: 'external_id',
                  value: 'myusername'
                }
              ],
              attributes: {
                contact_pref: 'email',
                joined: '2017'
              }
            }
          }
        }
      });

      const {
        eventSourceField,
        eventTypeField,
        eventDescriptionField,
        eventCreatedAtField,
        profileSourceField,
        profileTypeField,
        profileNameField,
        profileUserIdField
      } = getFromFields();

      expect(eventSourceField.value).toBe('fb');
      expect(eventTypeField.value).toBe('web');
      expect(eventDescriptionField.value).toBe('event description');
      expect(eventCreatedAtField.value).toBe('2012-03-02T04:07:34.0218628Z');
      expect(getTextFieldByLabel('Event Property Key 0').value).toBe(
        'passcode_preference'
      );
      expect(getTextFieldByLabel('Event Property Value 0').value).toBe('SMS');

      expect(profileSourceField.value).toBe('acme');
      expect(profileTypeField.value).toBe('customer');
      expect(profileNameField.value).toBe('John Doe');
      expect(profileUserIdField.value).toBe('1234');
      expect(getTextFieldByLabel('Profile Identifier Type 0').value).toBe(
        'email'
      );
      expect(getTextFieldByLabel('Profile Identifier Value 0').value).toBe(
        'jdoe@example.com'
      );
      expect(getTextFieldByLabel('Profile Identifier Type 1').value).toBe(
        'external_id'
      );
      expect(getTextFieldByLabel('Profile Identifier Value 1').value).toBe(
        'myusername'
      );
      expect(getTextFieldByLabel('Profile Attribute Key 0').value).toBe(
        'contact_pref'
      );
      expect(getTextFieldByLabel('Profile Attribute Value 0').value).toBe(
        'email'
      );
      expect(getTextFieldByLabel('Profile Attribute Key 1').value).toBe(
        'joined'
      );
      expect(getTextFieldByLabel('Profile Attribute Value 1').value).toBe(
        '2017'
      );
    });

    test('sets settings from form values', async () => {
      renderView(CreateEvent);

      extensionBridge.init({
        settings: {
          zendeskEvent: {
            event: {
              source: 'fb',
              type: 'web',
              description: 'event description',
              created_at: '2012-03-02T04:07:34.0218628Z',
              properties: {
                passcode_preference: 'SMS'
              }
            },
            profile: {
              source: 'acme',
              type: 'customer',
              name: 'John Doe',
              user_id: '1234',
              identifiers: [
                {
                  type: 'email',
                  value: 'jdoe@example.com'
                },
                {
                  type: 'external_id',
                  value: 'myusername'
                }
              ],
              attributes: {
                contact_pref: 'email',
                joined: '2017'
              }
            }
          }
        }
      });

      const {
        eventSourceField,
        eventTypeField,
        eventDescriptionField,
        eventCreatedAtField,
        profileSourceField,
        profileTypeField,
        profileNameField,
        profileUserIdField
      } = getFromFields();

      await changeInputValue(eventSourceField, 'twitter');
      await changeInputValue(eventTypeField, 'mobile');
      await changeInputValue(
        eventDescriptionField,
        'updated event description'
      );
      await changeInputValue(
        eventCreatedAtField,
        '2015-03-02T04:07:34.0218628Z'
      );
      await changeInputValue(
        getTextFieldByLabel('Event Property Key 0'),
        'page_url'
      );
      await changeInputValue(
        getTextFieldByLabel('Event Property Value 0'),
        'some url'
      );

      await changeInputValue(profileSourceField, 'not acme');
      await changeInputValue(profileTypeField, 'crm');
      await changeInputValue(profileNameField, 'Travis Doe');
      await changeInputValue(profileUserIdField, '23456');

      await changeInputValue(
        getTextFieldByLabel('Profile Identifier Type 1'),
        'alternate_email'
      );
      await changeInputValue(
        getTextFieldByLabel('Profile Identifier Value 1'),
        'JoeJoe@yahoo.com'
      );
      await click(getTextFieldByLabel('Delete Profile Identifier Row 0'));

      await changeInputValue(
        getTextFieldByLabel('Profile Attribute Key 0'),
        'alternate_name'
      );
      await changeInputValue(
        getTextFieldByLabel('Profile Attribute Value 0'),
        'JoeJoe'
      );
      await click(getTextFieldByLabel('Delete Profile Attribute Row 1'));

      expect(extensionBridge.getSettings()).toEqual({
        zendeskEvent: {
          event: {
            source: 'twitter',
            type: 'mobile',
            description: 'updated event description',
            created_at: '2015-03-02T04:07:34.0218628Z',
            properties: { page_url: 'some url' }
          },
          profile: {
            source: 'not acme',
            type: 'crm',
            name: 'Travis Doe',
            user_id: '23456',
            identifiers: [
              {
                type: 'alternate_email',
                value: 'JoeJoe@yahoo.com'
              }
            ],
            attributes: { alternate_name: 'JoeJoe' }
          }
        }
      });
    }, 10000);

    test('handles form validation correctly', async () => {
      renderView(CreateEvent);

      extensionBridge.init({
        settings: {
          zendeskEvent: {
            event: {
              source: 'a',
              type: 'b',
              properties: {
                e: 'f'
              }
            },
            profile: {
              source: 'g',
              type: 'h',
              identifiers: [
                {
                  type: 'k',
                  value: 'l'
                }
              ]
            }
          }
        }
      });

      const {
        eventSourceField,
        eventTypeField,
        profileSourceField,
        profileTypeField
      } = getFromFields();

      expect(eventSourceField).not.toHaveAttribute('aria-invalid', 'true');
      await changeInputValue(eventSourceField, '');

      expect(eventTypeField).not.toHaveAttribute('aria-invalid', 'true');
      await changeInputValue(eventTypeField, '');

      expect(profileSourceField).not.toHaveAttribute('aria-invalid', 'true');
      await changeInputValue(profileSourceField, '');

      expect(profileTypeField).not.toHaveAttribute('aria-invalid', 'true');
      await changeInputValue(profileTypeField, '');

      const eventPropertyKeyField = getTextFieldByLabel('Event Property Key 0');
      expect(eventPropertyKeyField).not.toHaveAttribute('aria-invalid', 'true');
      await changeInputValue(eventPropertyKeyField, '');

      const eventPropertyValueField = getTextFieldByLabel(
        'Event Property Value 0'
      );
      expect(eventPropertyValueField).not.toHaveAttribute(
        'aria-invalid',
        'true'
      );
      await changeInputValue(eventPropertyValueField, '');

      const profileIdentifierTypeField = getTextFieldByLabel(
        'Profile Identifier Type 0'
      );
      expect(profileIdentifierTypeField).not.toHaveAttribute(
        'aria-invalid',
        'true'
      );
      await changeInputValue(profileIdentifierTypeField, '');

      const profileIdentifierValueField = getTextFieldByLabel(
        'Profile Identifier Value 0'
      );
      expect(profileIdentifierValueField).not.toHaveAttribute(
        'aria-invalid',
        'true'
      );
      await changeInputValue(profileIdentifierValueField, '');

      await extensionBridge.validate();

      expect(eventSourceField).toHaveAttribute('aria-invalid', 'true');
      expect(eventTypeField).toHaveAttribute('aria-invalid', 'true');
      expect(profileSourceField).toHaveAttribute('aria-invalid', 'true');
      expect(profileTypeField).toHaveAttribute('aria-invalid', 'true');
      expect(eventPropertyKeyField).toHaveAttribute('aria-invalid', 'true');
      expect(eventPropertyValueField).toHaveAttribute('aria-invalid', 'true');
      expect(profileIdentifierTypeField).toHaveAttribute(
        'aria-invalid',
        'true'
      );
      expect(profileIdentifierValueField).toHaveAttribute(
        'aria-invalid',
        'true'
      );
    });
  });
  describe('raw view', () => {
    test('sets form values from setting', async () => {
      renderView(CreateEvent);

      extensionBridge.init({
        settings: {
          zendeskEvent: {
            event: {
              source: 'a',
              type: 'b',
              properties: {
                e: 'f'
              }
            },
            profile: {
              source: 'g',
              type: 'h',
              identifiers: [
                {
                  type: 'k',
                  value: 'l'
                }
              ]
            }
          }
        }
      });

      await click(getTextFieldByLabel('Raw View'));
      const { rawEventField } = getFromFields();

      expect(rawEventField.value).toBe(
        '{\n  "event": {\n    "source": "a",\n    "type": "b",\n    "properties": {\n  ' +
          '    "e": "f"\n    }\n  },\n  "profile": {\n    "source": "g",\n  ' +
          '  "type": "h",\n    "identifiers": [\n      {\n        "type": "k",\n   ' +
          '     "value": "l"\n      }\n    ]\n  }\n}'
      );
    });

    test('sets settings from form values', async () => {
      renderView(CreateEvent);

      extensionBridge.init({
        settings: {
          zendeskEvent: {
            event: {
              source: 'fb',
              type: 'web',
              description: 'event description',
              created_at: '2012-03-02T04:07:34.0218628Z',
              properties: {
                passcode_preference: 'SMS'
              }
            },
            profile: {
              source: 'acme',
              type: 'customer',
              name: 'John Doe',
              user_id: '1234',
              identifiers: [
                {
                  type: 'email',
                  value: 'jdoe@example.com'
                },
                {
                  type: 'external_id',
                  value: 'myusername'
                }
              ],
              attributes: {
                contact_pref: 'email',
                joined: '2017'
              }
            }
          }
        }
      });

      await click(getTextFieldByLabel('Raw View'));
      const { rawEventField } = getFromFields();
      await changeInputValue(
        rawEventField,
        '{{"event":{{"source":"","type":"","properties":{{"":""}},' +
          '"profile":{{"source":"","type":"","identifiers":[[{{"type":"","value":""}]}}'
      );

      expect(extensionBridge.getSettings()).toEqual({
        zendeskEvent: {
          event: {
            source: '',
            type: '',
            properties: {
              '': ''
            }
          },
          profile: {
            source: '',
            type: '',
            identifiers: [
              {
                type: '',
                value: ''
              }
            ]
          }
        }
      });
    });

    test('handles form validation correctly', async () => {
      renderView(CreateEvent);

      extensionBridge.init({
        settings: {
          zendeskEvent: {
            event: {
              source: 'a',
              type: 'b',
              properties: {
                c: 'd'
              }
            },
            profile: {
              source: 'e',
              type: 'f',
              identifiers: [
                {
                  type: 'g',
                  value: 'h'
                }
              ]
            }
          }
        }
      });

      await click(getTextFieldByLabel('Raw View'));

      await extensionBridge.validate();
      const { rawEventField } = getFromFields();

      expect(rawEventField).not.toHaveAttribute('aria-invalid', 'true');
      await changeInputValue(rawEventField, '');

      await extensionBridge.validate();

      expect(rawEventField).toHaveAttribute('aria-invalid', 'true');
    });
  });
});
