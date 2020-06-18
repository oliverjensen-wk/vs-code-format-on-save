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
import { devDependenciesContains, dependencyHasValidMinVersion } from '../../extension_utils';

suite('Extension Utilities Tests', () => {
  suite('devDependenciesContains', () => {
    suite('returns true when', () => {
      test('dev_dependencies has that dependency', () => {
        assert.equal(devDependenciesContains('over_react_format', c.orfDevDependency), true);
      });
    });

    suite('returns false when', () => {
      test('the dependency is under "dependencies" and not "dev_dependencies"', () => {
        assert.equal(devDependenciesContains('over_react_format', c.orfAsDependency), false);
      });

      test('the dependency is commented out', () => {
        assert.equal(devDependenciesContains('over_react_format', c.orfDevDependencyCommentedOut), false);
      });

      test('the dependency is not there', () => {
        assert.equal(devDependenciesContains('over_react_format', c.withoutOrf), false);
      });

      test('there is no dev_dependency section', () => {
        assert.equal(devDependenciesContains('over_react_format', c.noDependencies), false);
      });
    });

    suite('does not error when', () => {
      test('the dev_dependency section is empty', () => {
        assert.equal(devDependenciesContains('over_react_format', c.emptyDependencies), false);
      });
    });
  });

  suite('dependencyHasValidMinVersion', () => {
    const orfMinVersion = '>=3.0.0';
    const over_react_format_key = 'over_react_format';

    suite('returns true when', () => {
      test('the dependency is higher than necessary', () => {
        assert.equal(dependencyHasValidMinVersion(over_react_format_key, orfMinVersion, c.orfHighMinValue), true);
      });

      suite('the dependency is a simple key value pair', () => {
        test('and the dependency is within "dependencies" and within the given range', () => {
          assert.equal(dependencyHasValidMinVersion(over_react_format_key, orfMinVersion, c.orfAsDependency), true);
        });
  
        test('and the dependency is within "dev_dependencies" and within the given range', () => {
          assert.equal(dependencyHasValidMinVersion(over_react_format_key, orfMinVersion, c.orfDevDependency, true), true);
        });
      })

      suite('the dependency is hosted', () => {
        test('and the dependency is within "dependencies" and within the given range', () => {
          assert.equal(dependencyHasValidMinVersion(over_react_format_key, orfMinVersion, c.orfHostDependency), true);
        });
  
        test('and the dependency is within "dev_dependencies" and within the given range', () => {
          assert.equal(dependencyHasValidMinVersion(over_react_format_key, orfMinVersion, c.orfHostDevDependency, true), true);
        });
      });
    });

    suite('returns false when', () => {
      test('the dependency is not there', () => {
        assert.equal(dependencyHasValidMinVersion(over_react_format_key, orfMinVersion, c.withoutOrf), false);
      });

      test('there is no dependency section', () => {
        assert.equal(dependencyHasValidMinVersion(over_react_format_key, orfMinVersion, c.noDependencies), false);
      });

      test('there is no dev_dependency section', () => {
        assert.equal(dependencyHasValidMinVersion(over_react_format_key, orfMinVersion, c.noDependencies, true), false);
      });
    });

    suite('does not error when', () => {
      test('the dependency section is empty', () => {
        assert.equal(dependencyHasValidMinVersion(over_react_format_key, orfMinVersion, c.emptyDependencies), false);
      });

      test('the dev_dependency section is empty', () => {
        assert.equal(dependencyHasValidMinVersion(over_react_format_key, orfMinVersion, c.emptyDependencies, true), false);
      });
    });
  });
});
