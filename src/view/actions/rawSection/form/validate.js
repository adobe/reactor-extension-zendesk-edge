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

import VIEW_TYPE from '../../viewTypeSection/form/constants';

import {
  isArray,
  isObject,
  isRequired,
  isDataElementToken
} from '../../../utils/validators';
import parseJson from '../../../utils/parseJson';
import getOrdinalNumber from '../../../utils/getOrdinalNumber';

const hasAtLeastOneKey = (v) => Object.keys(v).length > 0;

const isStringWithLength = (v) => typeof v === 'string' && v.length > 0;
const hasAtLeastOneItem = (v) => v.length > 0;

const isValidPropertiesObject = (v) => {
  const keys = Object.keys(v);

  for (let i = 0; i < keys.length; i += 1) {
    const k = keys[i];
    const keyRow = getOrdinalNumber(i + 1);

    if (!k) {
      return {
        result: false,
        extraErrorMessage:
          `The event properties ${keyRow} ` +
          'key should be a string having at least one character.'
      };
    }

    if (!v[k] || typeof v[k] !== 'string') {
      return {
        result: false,
        extraErrorMessage:
          `The event properties ${keyRow} ` +
          'value should be a string having at least one character.'
      };
    }
  }

  return { result: true };
};

const isValidIdentifiersArray = (v) => {
  for (let i = 0; i < v.length; i += 1) {
    const { type, value } = v[i];
    const keyRow = getOrdinalNumber(i + 1);

    if (!type || typeof type !== 'string') {
      return {
        result: false,
        extraErrorMessage:
          `The type attribute of the ${keyRow} ` +
          'identifier object should be a string having at least one character.'
      };
    }

    if (!value || typeof value !== 'string') {
      return {
        result: false,
        extraErrorMessage:
          `The value attribute of the ${keyRow} ` +
          'identifier object should be a string having at least one character.'
      };
    }
  }

  return { result: true };
};

const isValidAttributesObject = (v) => {
  const keys = Object.keys(v);

  for (let i = 0; i < keys.length; i += 1) {
    const k = keys[i];
    const keyRow = getOrdinalNumber(i + 1);

    if (!k) {
      return {
        result: false,
        extraErrorMessage:
          `The profile attributes ${keyRow} ` +
          'key should be a string having at least one character.'
      };
    }

    if (!v[k] || typeof v[k] !== 'string') {
      return {
        result: false,
        extraErrorMessage:
          `The profile attributes ${keyRow} ` +
          'value should be a string having at least one character.'
      };
    }
  }

  return { result: true };
};

const runValidation = ([value, errorMessage, validations]) => {
  if (typeof value === 'undefined' && !validations.includes(isRequired)) {
    return {};
  }

  for (let i = 0; i < validations.length; i += 1) {
    const validationResult = validations[i](value);

    if (typeof validationResult === 'boolean' && !validationResult) {
      return { rawEvent: errorMessage };
    }

    if (typeof validationResult === 'object' && !validationResult.result) {
      return {
        rawEvent: `${errorMessage} ${validationResult.extraErrorMessage}`
      };
    }
  }

  return {};
};

export default ({ viewType, rawEvent }) => {
  let errors = {};
  if (viewType === VIEW_TYPE.FORM || isDataElementToken(rawEvent)) {
    return {};
  }

  if (!rawEvent) {
    return {
      rawEvent: 'Please provide a valid JSON or a data element.'
    };
  }

  const { message: errorMessage = '' } = parseJson(rawEvent);
  if (errorMessage) {
    return {
      rawEvent: `Please provide a valid JSON or a data element. ${errorMessage}.`
    };
  }

  const { event, profile } = JSON.parse(rawEvent);

  const validations = [
    [
      event?.source,
      'The event source attribute is required. It must be a string having at least one character.',
      [isRequired, isStringWithLength]
    ],
    [
      event?.type,
      'The event type attribute is required. It must be a string having at least one character.',
      [isRequired, isStringWithLength]
    ],
    [
      event?.description,
      'The event description attribute is not required, but if it is provided' +
        ' it must must be a string having at least one character.',
      [isStringWithLength]
    ],
    [
      event?.created_at,
      'The event created_at attribute is not required, but if it is provided' +
        ' it must must be a string having at least one character.',
      [isStringWithLength]
    ],
    [
      event?.properties,
      'The event properties is required. It must be an object ' +
        'containing at least one key and property value.',
      [isRequired, isObject, hasAtLeastOneKey, isValidPropertiesObject]
    ],
    [
      profile?.source,
      'The profile source attribute is required.' +
        ' It must be a string having at least one character.',
      [isRequired, isStringWithLength]
    ],
    [
      profile?.type,
      'The profile type attribute is required. It must be a string having at least one character.',
      [isRequired, isStringWithLength]
    ],
    [
      profile?.name,
      'The profile name attribute is not required, but if it is provided' +
        ' it must must be a string having at least one character.',
      [isStringWithLength]
    ],
    [
      profile?.user_id,
      'The profile used_id attribute is not required, but if it is provided' +
        ' it must must be a string having at least one character.',
      [isStringWithLength]
    ],
    [
      profile?.identifiers,
      'The profile identifiers attribute is required. It must be an array ' +
        'containg at least one identifier object. Each object consists of a type and a value.',
      [isRequired, isArray, hasAtLeastOneItem, isValidIdentifiersArray]
    ],
    [
      profile?.attributes,
      'The profile attributes should be an object ' +
        'containing at least one key and property value.',
      [isObject, hasAtLeastOneKey, isValidAttributesObject]
    ]
  ];

  for (let i = 0; i < validations.length; i += 1) {
    const validationError = Object.assign(
      errors,
      runValidation(validations[i])
    );

    if (Object.keys(validationError).length > 0) {
      errors = Object.assign(errors, validationError);
      break;
    }
  }

  return errors;
};
