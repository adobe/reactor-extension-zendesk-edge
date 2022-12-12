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

import React, { useState } from 'react';
import { Controller, useFormContext, useFieldArray } from 'react-hook-form';
import { Flex, RadioGroup, Radio, Text, View } from '@adobe/react-spectrum';
import { isValidJson, isDataElementToken } from '../../../utils/validators';
import {
  rawFromFields,
  fieldsFromRaw
} from '../../../utils/zendeskEventTransformers';
import VIEW_TYPE from '../form/constants';

export default function ProfileFields() {
  const { control, watch, setValue } = useFormContext();
  const [showViewTypeError, setShowViewTypeError] = useState(false);
  const [event, profile, rawEvent] = watch(['event', 'profile', 'rawEvent']);
  const { append: appendProperty, remove: removeAllProperties } = useFieldArray(
    {
      name: 'event.properties'
    }
  );
  const { append: appendIdentifier, remove: removeAllIdentifiers } =
    useFieldArray({
      name: 'profile.identifiers'
    });

  const { append: appendAttribute, remove: removeAllAttributes } =
    useFieldArray({
      name: 'profile.attributes'
    });

  return (
    <Controller
      control={control}
      name="viewType"
      defaultValue=""
      render={({ field: { onChange, value } }) => (
        <Flex direction="column" gap="size-50">
          <RadioGroup
            label="Choose the way you would want to provide the event"
            value={value}
            validationState={showViewTypeError ? 'invalid' : ''}
            onChange={(v) => {
              if (v === VIEW_TYPE.RAW) {
                rawFromFields({ event, profile, rawEvent }, { setValue });
              }

              if (v === VIEW_TYPE.FORM) {
                if (
                  rawEvent &&
                  !isDataElementToken(rawEvent) &&
                  !isValidJson(rawEvent)
                ) {
                  setShowViewTypeError(true);
                  return;
                }

                setShowViewTypeError(false);

                fieldsFromRaw(rawEvent, {
                  setValue,
                  appendProperty,
                  removeAllProperties,
                  appendIdentifier,
                  removeAllIdentifiers,
                  appendAttribute,
                  removeAllAttributes
                });
              }

              onChange(v);
            }}
          >
            <Flex alignItems="center">
              <Radio value={VIEW_TYPE.FORM}>Form View</Radio>
              <Radio value={VIEW_TYPE.RAW}>Raw View</Radio>
            </Flex>
          </RadioGroup>
          {showViewTypeError && (
            <View>
              <Text
                UNSAFE_style={{
                  fontSize: 'var(--spectrum-global-dimension-font-size-75)',
                  position: 'relative',
                  top: '-0.75rem',
                  color:
                    'var(--spectrum-semantic-negative-color-text-small' +
                    ',var(--spectrum-global-color-red-600))'
                }}
              >
                The Zendesk event field must contain a valid JSON or a data
                element before being able to switch to the form view.
              </Text>
            </View>
          )}
        </Flex>
      )}
    />
  );
}
