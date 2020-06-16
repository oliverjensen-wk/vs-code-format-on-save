// Copyright 2020 Workiva Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import * as assert from 'assert';
import { test, suite } from 'mocha';

import * as c from './constants';
import { devDependenciesContains } from '../../extension_utils';
import { existsSync, unlinkSync, writeFileSync } from 'fs';

suite('Extension Test', () => {
  suite('devDependenciesContains', () => {
    const tempPubspecPath = './test_pubspec.yaml'
    suiteTeardown(() => {
      if (existsSync(tempPubspecPath)) {
        unlinkSync(tempPubspecPath);
      }
    });

    function createPubspec(contents:string):void {
      writeFileSync(tempPubspecPath, contents, 'utf8');
      assert.equal(existsSync(tempPubspecPath), true);
    }

    suite('returns true when', () => {
      test('dev_dependencies has that dependency', () => {
        createPubspec(c.pubspecWithOverReactFormat);
        assert.equal(devDependenciesContains('over_react_format', tempPubspecPath), true);
      });
    });

    suite('returns false when', () => {
      test('the dependency is under "dependencies" and not "dev_dependencies"', () => {
        createPubspec(c.pubspecWithOverReactFormatAsDependency);
        assert.equal(devDependenciesContains('over_react_format', tempPubspecPath), false);
      });

      test('the dependency is commented out', () => {
        createPubspec(c.pubspecWithOverReactFormatCommentedOut);
        assert.equal(devDependenciesContains('over_react_format', tempPubspecPath), false);
      });

      test('the dependency is not there', () => {
        createPubspec(c.pubspecWithoutOverReactFormat);
        assert.equal(devDependenciesContains('over_react_format', tempPubspecPath), false);
      });

      test('there is no dev_dependency section', () => {
        createPubspec(c.pubspecWithoutDevDependencies);
        assert.equal(devDependenciesContains('over_react_format', tempPubspecPath), false);
      });
    });

    suite('does not error when', () => {
      test('the dev_dependency section is empty', () => {
        createPubspec(c.pubspecWithEmptyDevDependencySection);
        assert.equal(devDependenciesContains('over_react_format', tempPubspecPath), false);
      });
    });
  });
});
