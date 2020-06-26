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

const orfVersion = '^3.0.0';

export const pubspecHeader = `
name: over_react_format
publish_to: https://pub.workiva.org
version: 3.0.0
environment:
  sdk: '>=2.3.0 <3.0.0'     
`;

export const orfDevDependency = `
${pubspecHeader}
dependencies:
  analyzer: '>=0.38.4 <0.40.0'
    
dev_dependencies:
  over_react_format: ${orfVersion}
`;

export const withoutOrf = `
${pubspecHeader}
dependencies:
  analyzer: '>=0.38.4 <0.40.0'
    
dev_dependencies:
  random_package: ${orfVersion}
`;

export const emptyDependencies = `
${pubspecHeader}
dependencies:
    
dev_dependencies:
`;

export const orfDevDependencyCommentedOut = `
${pubspecHeader}
dependencies:
  analyzer: '>=0.38.4 <0.40.0'
    
dev_dependencies:
#  over_react_format: ${orfVersion}
  aRandomDependency: ^1.0.0
`;

export const noDependencies = `
${pubspecHeader}    
`;

export const orfAsDependency = `
${pubspecHeader}  
dependencies:
  analyzer: '>=0.38.4 <0.40.0'
  over_react_format: ${orfVersion}

dev_dependencies:
  random_package: ${orfVersion}
`;

export const orfHighMinValue = `
${pubspecHeader}  
dependencies:
  analyzer: '>=0.38.4 <0.40.0'
  over_react_format: ^3.8.0

dev_dependencies:
  random_package: 2.3.0
`;


export const orfHostDependency = `
${pubspecHeader}  
dependencies:
  analyzer: '>=0.38.4 <0.40.0'
  over_react_format:
    hosted:
      name: over_react_format
      url: https://aHostedUrl.org
    version: ^3.1.0

dev_dependencies:
  random_package: 2.3.0
`;

export const orfHostDevDependency = `
${pubspecHeader}  
dependencies:
  analyzer: '>=0.38.4 <0.40.0'

dev_dependencies:
  over_react_format:
    hosted:
      name: over_react_format
      url: https://aHostedUrl.org
    version: ${orfVersion}
`;
