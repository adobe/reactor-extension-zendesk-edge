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

import VIEW_TYPE from '../../viewTypeSection/form/constants';
import { addToEntityFromVariables } from '../../../utils/entityVariablesConverter';

export default ({
  viewType,
  profile: { source, type, identifiers, user_id, name, attributes }
}) => {
  if (viewType !== VIEW_TYPE.FORM) {
    return {};
  }

  identifiers = identifiers.filter((p) => p.type || p.value);

  const profile = {
    source,
    type,
    identifiers
  };

  profile.attributes = addToEntityFromVariables(
    {},
    attributes.filter((p) => p.key || p.value)
  );

  if (Object.keys(profile.attributes).length === 0) {
    delete profile.attributes;
  }

  Object.entries({ user_id, name }).forEach(([key, value]) => {
    if (value) {
      profile[key] = value;
    }
  });

  return {
    zendeskEvent: { profile }
  };
};
