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

const checkIdentifiers = (identifiersPairs, errors) => {
  const noIdentifiersPairs =
    identifiersPairs.length === 1 &&
    !identifiersPairs[0].type &&
    !identifiersPairs[0].value;

  if (noIdentifiersPairs) {
    errors[`profile.identifiers.0.type`] = 'Please provide a type.';
    errors[`profile.identifiers.0.value`] = 'Please provide a value.';
    return;
  }

  identifiersPairs.forEach((q, index) => {
    if (!q.type && q.value) {
      errors[`profile.identifiers.${index}.type`] = 'Please provide a type.';
    }

    if (!q.value && q.type) {
      errors[`profile.identifiers.${index}.value`] = 'Please provide a value.';
    }
  });
};

const checkAttributes = (attributesPairs, errors) => {
  if (JSON.stringify(attributesPairs) === '[{"key":"","value":""}]') {
    return;
  }

  attributesPairs.forEach((q, index) => {
    if (!q.key) {
      errors[`profile.attributes.${index}.key`] = 'Please provide a key name.';
    }

    if (!q.value) {
      errors[`profile.attributes.${index}.value`] = 'Please provide a value.';
    }
  });
};

export default ({
  viewType,
  profile: { source, type, identifiers, attributes }
}) => {
  if (viewType === VIEW_TYPE.RAW) {
    return {};
  }

  const errors = {};
  const profileErrors = {};

  const requiredFields = { source, type };
  Object.entries(requiredFields).forEach(([key, value]) =>
    checkRequired(key, value, profileErrors)
  );

  if (Object.keys(profileErrors).length > 0) {
    errors.profile = profileErrors;
  }

  checkIdentifiers(identifiers, errors);
  checkAttributes(attributes, errors);

  return errors;
};
