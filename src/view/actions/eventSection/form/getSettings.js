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

/* eslint-disable camelcase */

import { addToEntityFromVariables } from '../../../utils/entityVariablesConverter';
import VIEW_TYPE from '../../viewTypeSection/form/constants';

export default ({
  viewType,
  event: { source, type, properties: propertiesPairs, description, created_at }
}) => {
  if (viewType !== VIEW_TYPE.FORM) {
    return {};
  }

  const properties = addToEntityFromVariables(
    {},
    propertiesPairs.filter((p) => p.key || p.value)
  );

  const event = {
    source,
    type,
    properties
  };

  Object.entries({ created_at, description }).forEach(([key, value]) => {
    if (value) {
      event[key] = value;
    }
  });

  return {
    zendeskEvent: { event }
  };
};
