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

/* eslint-disable jsx-a11y/anchor-is-valid */

import React from 'react';
import {
  View,
  Link,
  Flex,
  ContextualHelp,
  Heading,
  Content
} from '@adobe/react-spectrum';
import WrappedTextField from '../../../components/wrappedTextField';

export default function Fields() {
  return (
    <Flex direction="column" gap="size-150" marginTop="size-300">
      <p>
        The{' '}
        <Link>
          <a
            href="https://developer.zendesk.com/documentation/custom-data/events/about-the-events-api/"
            target="_blank"
            rel="noreferrer"
          >
            Events API
          </a>
        </Link>{' '}
        lets you build a timeline of all your customer interactions from any
        source. Events can be any programmatic event, including purchase
        transactions, website visits, or customer service interactions.
      </p>
      <WrappedTextField
        width="size-6000"
        name="domain"
        label="Domain"
        necessityIndicator="label"
        isRequired
        supportDataElement
        description={
          'The domain that was generated during the Zendesk registration process' +
          ' (e.g. {subdomain}.zendesk.com).'
        }
      />

      <View>
        <WrappedTextField
          width="size-6000"
          name="token"
          label="Access Token"
          necessityIndicator="label"
          isRequired
          supportDataElement
          contextualHelp={
            <ContextualHelp>
              <Heading>Need help?</Heading>
              <Content>
                <p>
                  API requests made to the Events API must be authenticated.
                  You&rsquo;ll also need agent or admin permissions in the
                  account to use the API.
                </p>
                <p>
                  See{' '}
                  <Link>
                    <a
                      href="https://developer.zendesk.com/documentation/ticketing/working-with-oauth/creating-and-using-oauth-tokens-with-the-api/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Creating and using OAuth tokens with the API
                    </a>
                  </Link>{' '}
                  for more information on how to generate the access token.
                </p>
              </Content>
            </ContextualHelp>
          }
        />
      </View>
    </Flex>
  );
}
