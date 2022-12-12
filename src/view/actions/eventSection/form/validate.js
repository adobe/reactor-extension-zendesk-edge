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

import checkRequired from '../../../utils/checkRequired';
import VIEW_TYPE from '../../viewTypeSection/form/constants';

const checkProperties = (propertiesPairs, errors) => {
  const noPropertiesJsonPairs =
    Array.isArray(propertiesPairs) &&
    propertiesPairs.length === 1 &&
    !propertiesPairs[0].key &&
    !propertiesPairs[0].value;

  if (noPropertiesJsonPairs) {
    errors[`event.properties.0.key`] = 'Please provide a key name.';
    errors[`event.properties.0.value`] = 'Please provide a value.';
    return;
  }

  propertiesPairs.forEach((q, index) => {
    if (!q.key) {
      errors[`event.properties.${index}.key`] = 'Please provide a key name.';
    }

    if (!q.value) {
      errors[`event.properties.${index}.value`] = 'Please provide a value.';
    }
  });
};

export default ({ viewType, event: { source, type, properties } }) => {
  if (viewType === VIEW_TYPE.RAW) {
    return {};
  }

  const errors = {};
  const eventErrors = {};

  const requiredFields = { source, type };
  Object.entries(requiredFields).forEach(([key, value]) =>
    checkRequired(key, value, eventErrors)
  );

  if (Object.keys(eventErrors).length > 0) {
    errors.event = eventErrors;
  }

  checkProperties(properties, errors);

  return errors;
};
