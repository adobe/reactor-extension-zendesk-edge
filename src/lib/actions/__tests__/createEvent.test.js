/*
Copyright 2022 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

var createEvent = require('../createEvent');

describe('create event action', () => {
  test('makes the correct API calling', () => {
    const payload = {
      event: {
        source: 'acme',
        type: '2fa_enabled',
        properties: {
          contactMethod: 'sms'
        }
      },
      profile: {
        source: 'acme',
        type: 'customer',
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
          contactPref: 'email',
          joined: '2017'
        }
      }
    };

    const fetch = jest.fn(() =>
      Promise.resolve({
        arrayBuffer: () => Promise.resolve([114, 101, 115, 117, 108, 116]) //result
      })
    );

    const settings = {
      zendeskEvent: payload
    };

    var extensionSettings = {
      domain: 'd3v-dxinfosys.zendesk.com',
      token: 'beba771daa01125061a806dd5ac80b9f42b03c114e93319a8e3ca3c5261a377d'
    };

    var arc = {
      ruleStash: {}
    };

    const utils = {
      fetch: fetch,
      getSettings: () => settings,
      getExtensionSettings: () => extensionSettings
    };

    return createEvent({ arc, utils }).then(() => {
      expect(fetch).toHaveBeenCalledWith(
        'https://d3v-dxinfosys.zendesk.com/api/v2/user_profiles/events',
        {
          method: 'POST',
          headers: {
            Authorization:
              'Bearer ' +
              'beba771daa01125061a806dd5ac80b9f42b03c114e93319a8e3ca3c5261a377d',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        }
      );
    });
  });
});
