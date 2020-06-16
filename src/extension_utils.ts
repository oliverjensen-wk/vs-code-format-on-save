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
import * as yaml from 'yaml';
import { readFileSync } from 'fs';

// Checks a dependency against a pubspec.yaml's dev_dependency section and returns whether
// or not it is present. 
export function devDependenciesContains(dependency:string, pathToPubspec:string):Boolean {
    const pubspec:yaml.Document = yaml.parseDocument(readFileSync(pathToPubspec, 'utf8'));
    if (pubspec.contents.has('dev_dependencies')) {
        const dev_dependencies = pubspec.contents.get('dev_dependencies');
        if (dev_dependencies !== null) {
            return dev_dependencies.has(dependency);
        }
    }

    return false;
}
