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

import getEmptyPropertyValues from '../actions/eventSection/form/getEmptyPropertyValues';
import getEmptyProfileIdentifierValue from '../actions/profileSection/form/getEmptyProfileIdentifierValue';
import getEmptyProfileAttributeValue from '../actions/profileSection/form/getEmptyProfileAttributeValue';
import {
  addToVariablesFromEntity,
  addToEntityFromVariables
} from './entityVariablesConverter';
import { isDataElementToken } from './validators';

const removeEmptyOptionalFields = (zendeskEventClone) => {
  ['created_at', 'description'].forEach((v) => {
    if (!zendeskEventClone.event[v]) {
      delete zendeskEventClone.event[v];
    }
  });

  ['name', 'user_id'].forEach((v) => {
    if (!zendeskEventClone.profile[v]) {
      delete zendeskEventClone.profile[v];
    }
  });
};

const transformEventProperties = (zendeskEventClone) => {
  zendeskEventClone.event.properties = addToEntityFromVariables(
    {},
    zendeskEventClone.event.properties
  );
};

const transformProfileAttributes = (zendeskEventClone) => {
  if (
    JSON.stringify(zendeskEventClone.profile.attributes) ===
    '[{"key":"","value":""}]'
  ) {
    delete zendeskEventClone.profile.attributes;
    return;
  }

  zendeskEventClone.profile.attributes = addToEntityFromVariables(
    {},
    zendeskEventClone.profile.attributes
  );
};

export const rawFromFields = ({ event, profile, rawEvent }, { setValue }) => {
  const zendeskEventClone = JSON.parse(JSON.stringify({ event, profile }));

  removeEmptyOptionalFields(zendeskEventClone);
  transformEventProperties(zendeskEventClone);
  transformProfileAttributes(zendeskEventClone);

  if (
    JSON.stringify(zendeskEventClone) ===
      '{"event":{"source":"","type":"","properties":{}},"profile"' +
        ':{"source":"","type":"","identifiers":[{"type":"","value":""}]}}' &&
    isDataElementToken(rawEvent)
  ) {
    return;
  }

  setValue('rawEvent', JSON.stringify(zendeskEventClone, null, 2), {
    shouldValidate: true,
    shouldDirty: true,
    shouldTouch: true
  });
};

const fillInAllInputElements = (parsedEvent, { setValue }) => {
  [
    ['event.source', parsedEvent?.event?.source || ''],
    ['event.type', parsedEvent?.event?.type || ''],
    ['event.description', parsedEvent?.event?.description || ''],
    ['event.created_at', parsedEvent?.event?.created_at || ''],
    ['profile.source', parsedEvent?.profile?.source || ''],
    ['profile.type', parsedEvent?.profile?.type || ''],
    ['profile.name', parsedEvent?.profile?.name || ''],
    ['profile.user_id', parsedEvent?.profile?.user_id || '']
  ].forEach(([fieldName, value]) => {
    setValue(fieldName, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true
    });
  });
};

const fillInEventProperties = (
  parsedEvent,
  { appendProperty, removeAllProperties }
) => {
  const properties = parsedEvent?.event?.properties || {};

  removeAllProperties();

  if (Object.keys(properties).length === 0) {
    appendProperty(getEmptyPropertyValues());
    return;
  }

  addToVariablesFromEntity([], properties).forEach(({ key, value }) => {
    appendProperty({ key, value });
  });
};

const fillInProfileIdentifiers = (
  parsedEvent,
  { appendIdentifier, removeAllIdentifiers }
) => {
  const identifiers = parsedEvent?.profile?.identifiers || [];
  removeAllIdentifiers();

  if (identifiers.length === 0) {
    appendIdentifier(getEmptyProfileIdentifierValue());
    return;
  }

  identifiers.forEach(({ type, value }) => {
    appendIdentifier({ type, value });
  });
};

const fillInProfileAttributes = (
  parsedEvent,
  { appendAttribute, removeAllAttributes }
) => {
  const attributes = parsedEvent?.profile?.attributes || {};
  removeAllAttributes();

  if (Object.keys(attributes).length === 0) {
    appendAttribute(getEmptyProfileAttributeValue());
    return;
  }

  addToVariablesFromEntity([], attributes).forEach(({ key, value }) => {
    appendAttribute({ key, value });
  });
};

export const fieldsFromRaw = (
  rawEvent,
  {
    setValue,
    appendProperty,
    removeAllProperties,
    appendIdentifier,
    removeAllIdentifiers,
    appendAttribute,
    removeAllAttributes
  }
) => {
  let parsedEvent = {};
  try {
    parsedEvent = rawEvent ? JSON.parse(rawEvent) : {};
    fillInAllInputElements(parsedEvent, { setValue });
    fillInEventProperties(parsedEvent, { appendProperty, removeAllProperties });
    fillInProfileIdentifiers(parsedEvent, {
      appendIdentifier,
      removeAllIdentifiers
    });
    fillInProfileAttributes(parsedEvent, {
      appendAttribute,
      removeAllAttributes
    });
  } catch {
    // DO NOT DO ANYTHING
  }

  return parsedEvent;
};
