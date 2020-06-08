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

export const pubspecHeader = `
name: over_react_format
publish_to: https://pub.workiva.org
version: 3.0.0
environment:
  sdk: '>=2.3.0 <3.0.0'     
`;

export const pubspecWithOverReactFormat = `
${pubspecHeader}
dependencies:
  analyzer: '>=0.38.4 <0.40.0'
    
dev_dependencies:
  over_react_format: ^3.0.0
`;

export const pubspecWithoutOverReactFormat = `
${pubspecHeader}
dependencies:
  analyzer: '>=0.38.4 <0.40.0'
    
dev_dependencies:
  random_package: ^3.0.0
`;

export const pubspecWithEmptyDevDependencySection = `
${pubspecHeader}
dependencies:
  analyzer: '>=0.38.4 <0.40.0'
    
dev_dependencies:
`;

export const pubspecWithOverReactFormatCommentedOut = `
${pubspecHeader}
dependencies:
  analyzer: '>=0.38.4 <0.40.0'
    
dev_dependencies:
#  over_react_format: ^3.0.0
  aRandomDependency: ^1.0.0
`;

export const pubspecWithoutDevDependencies = `
${pubspecHeader}    
dependencies:
  analyzer: '>=0.38.4 <0.40.0'
`;

export const pubspecWithOverReactFormatAsDependency = `
${pubspecHeader}  
dependencies:
  analyzer: '>=0.38.4 <0.40.0'
  over_react_format: ^3.0.0

dev_dependencies:
  random_package: ^3.0.0
`;
