/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ReaderFragment } from 'relay-runtime';
import type { FragmentReference } from "relay-runtime";
declare export opaque type UserFragment$ref: FragmentReference;
declare export opaque type UserFragment$fragmentType: UserFragment$ref;
export type UserFragment = {|
  +email: ?string,
  +nickname: ?string,
  +$refType: UserFragment$ref,
|};
export type UserFragment$data = UserFragment;
export type UserFragment$key = {
  +$data?: UserFragment$data,
  +$fragmentRefs: UserFragment$ref,
  ...
};
*/


const node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "UserFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "email",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "nickname",
      "storageKey": null
    }
  ],
  "type": "user",
  "abstractKey": null
};
// prettier-ignore
(node/*: any*/).hash = '826c265e9cc5a35652a64d7c2ac36f34';

module.exports = node;
