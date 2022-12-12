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

import React from 'react';
import { Flex } from '@adobe/react-spectrum';

import ExtensionView from '../components/extensionView';
import objectDeepMerge from '../utils/objectDeepMerge';

import ViewTypeFields from './viewTypeSection/components/fields';
import getViewTypeInitValues from './viewTypeSection/form/getInitValues';
import getViewTypeSettings from './viewTypeSection/form/getSettings';
import validateViewTypeFields from './viewTypeSection/form/validate';

import EventFields from './eventSection/components/fields';
import getEventInitValues from './eventSection/form/getInitValues';
import getEventSettings from './eventSection/form/getSettings';
import validateEventFields from './eventSection/form/validate';

import ProfileFields from './profileSection/components/fields';
import getProfileInitValues from './profileSection/form/getInitValues';
import getProfileSettings from './profileSection/form/getSettings';
import validateProfileFields from './profileSection/form/validate';

import RawFields from './rawSection/components/fields';
import getRawInitValues from './rawSection/form/getInitValues';
import getRawSettings from './rawSection/form/getSettings';
import validateRawFields from './rawSection/form/validate';

export default function CreateEvent() {
  return (
    <ExtensionView
      getInitialValues={({ initInfo }) => ({
        ...getViewTypeInitValues(initInfo),
        ...getEventInitValues(initInfo),
        ...getProfileInitValues(initInfo),
        ...getRawInitValues(initInfo)
      })}
      getSettings={({ values }) =>
        objectDeepMerge(
          getViewTypeSettings(values),
          getEventSettings(values),
          getProfileSettings(values),
          getRawSettings(values)
        )
      }
      validate={(values) => ({
        ...validateViewTypeFields(values),
        ...validateEventFields(values),
        ...validateProfileFields(values),
        ...validateRawFields(values)
      })}
      render={() => (
        <>
          <ViewTypeFields />
          <Flex direction="column" gap="size-150">
            <EventFields />
            <ProfileFields />
            <RawFields />
          </Flex>
        </>
      )}
    />
  );
}
