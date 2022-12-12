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
  Heading,
  Link,
  Flex,
  ContextualHelp,
  Content,
  Text
} from '@adobe/react-spectrum';
import { useFormContext } from 'react-hook-form';
import WrappedTextField from '../../../components/wrappedTextField';
import KeyValueEditor from '../../../components/keyValueEditor';
import getEmptyProperty from '../form/getEmptyPropertyValues';
import PropertyRow from './propertyRow';

export default function EventFields() {
  const { watch } = useFormContext();
  const [viewType] = watch(['viewType']);

  return (
    viewType === 'form' && (
      <View minWidth="size-4600">
        <Heading level="3">
          <Flex alignItems="center" gap="size-50">
            <Text>Event</Text>
            <ContextualHelp>
              <Heading>Need help?</Heading>
              <Content>
                See{' '}
                <Link>
                  <a
                    href="https://developer.zendesk.com/documentation/custom-data/events/getting-started-with-events/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Getting started with events
                  </a>
                </Link>{' '}
                for more information.
              </Content>
            </ContextualHelp>
          </Flex>
        </Heading>

        <Flex direction="column" gap="size-150">
          <WrappedTextField
            width="size-4600"
            name="event.source"
            label="Source"
            necessityIndicator="label"
            isRequired
            supportDataElement
            description={
              'Application which sent the event. ' +
              "Do not use 'zendesk' as a source name because the call will not be accepted."
            }
          />
          <WrappedTextField
            width="size-4600"
            name="event.type"
            label="Type"
            necessityIndicator="label"
            isRequired
            supportDataElement
          />

          <WrappedTextField
            width="size-4600"
            name="event.description"
            label="Description"
            supportDataElement
          />

          <WrappedTextField
            width="size-4600"
            name="event.created_at"
            label="Created At"
            supportDataElement
            description={
              'ISO-8601 compliant date-time reflecting the time the event was created. ' +
              'If not set, the API sets the value when it receives the event.'
            }
          />

          <KeyValueEditor
            label="Properties"
            isRequired
            necessityIndicator="label"
            name="event.properties"
            getEmptyValueFn={getEmptyProperty}
            row={PropertyRow}
          />
        </Flex>
      </View>
    )
  );
}
