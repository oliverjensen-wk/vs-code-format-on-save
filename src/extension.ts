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
import {exec, ChildProcess} from 'child_process'

export function activate(context: vscode.ExtensionContext) {
	let extension = new RunFormatOnSave(context);

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

	constructor(context: vscode.ExtensionContext) {
		this.context = context;
		this.loadConfig();
		this.showEnablingChannelMessage();
	}

	loadConfig() {
		this.config = vscode.workspace.getConfiguration('formatOnSave');
	}
	
	private showEnablingChannelMessage () {
		let message = `Run OverReact Format on Save is ${this.getEnabled() ? 'enabled' : 'disabled'}`;
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
		let disposable = vscode.window.setStatusBarMessage(message, 3000);
		this.context.subscriptions.push(disposable);
	}

	onDocumentSave(document: vscode.TextDocument) {
		if (!this.getEnabled() || document.languageId !== 'dart') {
			return;
		}

		this.showChannelMessage(`Running OverReact Format...`);
		const projectDir = vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders[0].uri.path : "";

		const customLineLength = this.config.get<Number>('customLineLength', 0);
		const shouldDetectLineLength = this.config.get<Boolean>('detectCustomLineLength');
		const shouldUseCustomLineLength = customLineLength > 0;

		let command; 

		if (shouldUseCustomLineLength && shouldDetectLineLength) {
			this.showChannelMessage(`Both a custom line-length value and detectCustomLineLength set to true. Skipping line-length detection.`);
		}

		if (shouldUseCustomLineLength) {
			command =  `pub run over_react_format ${document.fileName} -l ${customLineLength}`;
		} else {
			const detectLineLengthFlag = shouldDetectLineLength && !shouldUseCustomLineLength ? "--detect-line-length" : "";
			command =  `pub run over_react_format ${document.fileName} -p ${projectDir} ${detectLineLengthFlag}`;
		} 

		this.showChannelMessage(command);

		let child:ChildProcess = exec(command, {cwd: projectDir});

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
