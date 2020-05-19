import * as vscode from 'vscode';
import {exec, ChildProcess} from 'child_process'

export function activate(context: vscode.ExtensionContext) {
	let extension = new RunFormatOnSave(context);

	context.subscriptions.push(
		vscode.workspace.onDidChangeConfiguration(() => {
			extension.loadConfig();
		}),

		vscode.commands.registerCommand('extension.enableFromatOnSave', () => {
			extension.setEnabled(true);
		}),

		vscode.commands.registerCommand('extension.disableFromatOnSave', () => {
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
		const shouldDetectLineLength = this.config.get<Boolean>('detectCustomLineLength');
		const detectLineLengthFlag = shouldDetectLineLength ? "--detect-line-length" : "";
		const command = `pub run over_react_format ${document.fileName} -p ${projectDir} ${detectLineLengthFlag}`;
		this.showChannelMessage(command);

		let child:ChildProcess = exec(command);
		
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
