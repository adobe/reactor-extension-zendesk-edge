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

import getEmptyProperty from './getEmptyPropertyValues';
import { addToVariablesFromEntity } from '../../../utils/entityVariablesConverter';

export default ({ settings }) => {
  const {
    zendeskEvent: {
      event: {
        source = '',
        type = '',
        properties: propertiesObject = {},
        created_at = '',
        description = ''
      } = {}
    } = {}
  } = settings || {};

  const properties = addToVariablesFromEntity([], propertiesObject);

  // For the first time we create an action, there will be no properties.
  if (properties.length === 0) {
    properties.push(getEmptyProperty());
  }

  return {
    event: { source, type, properties, created_at, description }
  };
};
