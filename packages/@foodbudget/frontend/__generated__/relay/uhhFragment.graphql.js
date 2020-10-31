/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ReaderFragment } from 'relay-runtime';
import type { FragmentReference } from "relay-runtime";
declare export opaque type uhhFragment$ref: FragmentReference;
declare export opaque type uhhFragment$fragmentType: uhhFragment$ref;
export type uhhFragment = {|
  +email: ?string,
  +nickname: ?string,
  +$refType: uhhFragment$ref,
|};
export type uhhFragment$data = uhhFragment;
export type uhhFragment$key = {
  +$data?: uhhFragment$data,
  +$fragmentRefs: uhhFragment$ref,
  ...
};
*/


const node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "uhhFragment",
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
(node/*: any*/).hash = '1e6377bf3c87ac88d0a00b880e3549d0';

module.exports = node;
