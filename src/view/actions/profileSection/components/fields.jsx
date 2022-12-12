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
  Content
} from '@adobe/react-spectrum';
import { useFormContext } from 'react-hook-form';
import IdentifierRow from './identifierRow';
import AttributesRow from './attributesRow';
import WrappedTextField from '../../../components/wrappedTextField';
import KeyValueEditor from '../../../components/keyValueEditor';
import getEmptyProfileIdentifierJson from '../form/getEmptyProfileIdentifierValue';
import getEmptyProfileAttributeValue from '../form/getEmptyProfileAttributeValue';

export default function ProfileFields() {
  const { watch } = useFormContext();
  const [viewType] = watch(['viewType']);

  return (
    viewType === 'form' && (
      <View minWidth="size-4600">
        <Heading level="3">Profile</Heading>
        <Flex direction="column" gap="size-150">
          <WrappedTextField
            width="size-4600"
            name="profile.source"
            label="Source"
            necessityIndicator="label"
            isRequired
            supportDataElement
            description="The product or service associated with the profile."
          />

          <WrappedTextField
            width="size-4600"
            name="profile.type"
            label="Type"
            necessityIndicator="label"
            isRequired
            supportDataElement
          />

          <WrappedTextField
            width="size-4600"
            name="profile.name"
            label="Name"
            description="The person's name for the profile."
            supportDataElement
          />

          <WrappedTextField
            width="size-4600"
            name="profile.user_id"
            label="User ID"
            supportDataElement
            description="Zendesk user ID that the profile belongs to. "
          />

          <KeyValueEditor
            label="Identifiers"
            isRequired
            necessityIndicator="label"
            name="profile.identifiers"
            getEmptyValueFn={getEmptyProfileIdentifierJson}
            row={IdentifierRow}
            contextualHelp={
              <ContextualHelp>
                <Heading>Need help?</Heading>
                <Content>
                  <p>
                    The identifiers array consists of one or more values used to
                    identify a person in an application or system. Each
                    identifier consists of a type and a value property which are
                    arbitrary. For example, an identifier can be of type
                    &quot;member_id&quot; with a value of &quot;0634335&quot;.
                  </p>
                  <p>
                    See{' '}
                    <Link>
                      <a
                        href="https://developer.zendesk.com/documentation/custom-data/profiles/anatomy-of-a-profile/#identifiers"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Anatomy of a profile
                      </a>
                    </Link>{' '}
                    for more information on identifiers.
                  </p>
                </Content>
              </ContextualHelp>
            }
          />

          <KeyValueEditor
            label="Attributes"
            name="profile.attributes"
            getEmptyValueFn={getEmptyProfileAttributeValue}
            row={AttributesRow}
          />
        </Flex>
      </View>
    )
  );
}
