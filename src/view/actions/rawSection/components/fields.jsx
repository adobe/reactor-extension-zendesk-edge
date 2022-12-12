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
import { useFormContext } from 'react-hook-form';
import { TextArea } from '@adobe/react-spectrum';
import WrappedTextField from '../../../components/wrappedTextField';

export default function RawFields() {
  const { watch } = useFormContext();
  const [viewType] = watch(['viewType']);

  return (
    viewType === 'raw' && (
      <WrappedTextField
        label="Zendesk Event"
        minWidth="size-4600"
        width="100%"
        component={TextArea}
        name="rawEvent"
        necessityIndicator="label"
        isRequired
        supportDataElement
        description={
          'Provide a JSON object or a data element that returns an object.' +
          ' The object must contain the "event" and "profile" properties.'
        }
      />
    )
  );
}
