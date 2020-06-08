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

import * as vscode from 'vscode';
import * as process from 'child_process'
import { existsSync } from 'fs';

import { devDependenciesContains } from './extension_utils';

export function activate(context: vscode.ExtensionContext) {
	const extension = new RunFormatOnSave(context);

	context.subscriptions.push(
		vscode.workspace.onDidChangeConfiguration(() => {
			extension.loadConfig();
		}),

		vscode.commands.registerCommand('extension.enableFormatOnSave', () => {
			extension.setEnabled(true);
		}),

		vscode.commands.registerCommand('extension.disableFormatOnSave', () => {
			extension.setEnabled(false);
		}),

		vscode.workspace.onDidSaveTextDocument((document: vscode.TextDocument) => {
			extension.onDocumentSave(document);
		})
	);

	return extension;
}

class RunFormatOnSave {
	private context: vscode.ExtensionContext;
	private config!: vscode.WorkspaceConfiguration;
	private channel: vscode.OutputChannel = vscode.window.createOutputChannel('Format on save')
	private projectDir = vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders[0].uri.path : "";
	private useOverReactFormat:Boolean = false; 

	constructor(context: vscode.ExtensionContext) {
		this.context = context;
		this.loadConfig();
		this.showEnablingChannelMessage();

		if (existsSync(`${this.projectDir}/pubspec.yaml`)) {
			this.useOverReactFormat = devDependenciesContains('over_react_format', `${this.projectDir}/pubspec.yaml`);
		}
		// No else condition because there's no penalty for the project not being a Dart project.
		// The `onDocumentSave` command will just be short-circuited if it is run on non-Dart files.
	}

	buildCommand(fileName: string) {
		let command:string;

		const customLineLength = this.config.get<Number>('customLineLength', 0);
		const shouldDetectLineLength = this.config.get<Boolean>('detectCustomLineLength');
		const shouldUseCustomLineLength = customLineLength > 0;

		if (shouldUseCustomLineLength && shouldDetectLineLength) {
			this.showChannelMessage(`Both a custom line-length value and detectCustomLineLength set to true. Skipping line-length detection.`);
		}

		if (this.useOverReactFormat) {
			if (shouldUseCustomLineLength) {
				command =  `pub run over_react_format ${fileName} -l ${customLineLength}`;
			} else {
				const detectLineLengthFlag = shouldDetectLineLength && !shouldUseCustomLineLength ? "--detect-line-length" : "";
				command =  `pub run over_react_format ${fileName} -p ${this.projectDir} ${detectLineLengthFlag}`;
			} 
		} else {
			// TODO add logic to detect line-length from dart_dev's config.dart
			command = `dartfmt -w ${fileName} ${shouldUseCustomLineLength ? `-l ${customLineLength}` : ''}`;
		}

		return command;
	}

	loadConfig() {
		this.config = vscode.workspace.getConfiguration('formatOnSave');
	}
	
	private showEnablingChannelMessage () {
		const message = `Run OverReact Format on Save is ${this.getEnabled() ? 'enabled' : 'disabled'}`;
		this.showChannelMessage(message);
		this.showStatusMessage(message);
	}

	private showChannelMessage(message: string) {
		this.channel.appendLine(message);
	}

	getEnabled(): boolean {
		return !!this.context.globalState.get('enabled', true);
	}
		
	setEnabled(enabled: boolean) {
		this.context.globalState.update('enabled', enabled);
		this.showEnablingChannelMessage();
	}

	private showStatusMessage(message: string) {
		const disposable = vscode.window.setStatusBarMessage(message, 3000);
		this.context.subscriptions.push(disposable);
	}

	onDocumentSave(document: vscode.TextDocument) {
		if (!this.getEnabled() || document.languageId !== 'dart') {
			return;
		}

		this.showChannelMessage(`Running ${this.useOverReactFormat ? 'OverReact Format' : 'dartfmt'}...`);

		const command = this.buildCommand(document.fileName); 

		this.showChannelMessage(command);

		const child:process.ChildProcess = process.exec(command, {cwd: this.projectDir});

		child.stdout!.on('data', data => this.channel.append(data.toString()));
		child.stderr!.on('data', data => this.channel.append(data.toString()));

		child.on('exit', (e) => {
			if (e === 0) {
				this.showStatusMessage('Formatting succeeded');
			}

			if (e !== 0) {
				this.channel.show(true);
			}
		});
	}
}
