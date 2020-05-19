"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const child_process_1 = require("child_process");
function activate(context) {
    let extension = new RunFormatOnSave(context);
    context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(() => {
        extension.loadConfig();
    }), vscode.commands.registerCommand('extension.enableFromatOnSave', () => {
        extension.setEnabled(true);
    }), vscode.commands.registerCommand('extension.disableFromatOnSave', () => {
        extension.setEnabled(false);
    }), vscode.workspace.onDidSaveTextDocument((document) => {
        extension.onDocumentSave(document);
    }));
    return extension;
}
exports.activate = activate;
class RunFormatOnSave {
    constructor(context) {
        this.channel = vscode.window.createOutputChannel('Format on save');
        this.context = context;
        this.loadConfig();
        this.showEnablingChannelMessage();
    }
    loadConfig() {
        this.config = vscode.workspace.getConfiguration('formatOnSave');
    }
    showEnablingChannelMessage() {
        let message = `Run OverReact Format on Save is ${this.getEnabled() ? 'enabled' : 'disabled'}`;
        this.showChannelMessage(message);
        this.showStatusMessage(message);
    }
    showChannelMessage(message) {
        this.channel.appendLine(message);
    }
    getEnabled() {
        return !!this.context.globalState.get('enabled', true);
    }
    setEnabled(enabled) {
        this.context.globalState.update('enabled', enabled);
        this.showEnablingChannelMessage();
    }
    showStatusMessage(message) {
        let disposable = vscode.window.setStatusBarMessage(message, 3000);
        this.context.subscriptions.push(disposable);
    }
    onDocumentSave(document) {
        if (!this.getEnabled() || document.languageId !== 'dart') {
            return;
        }
        this.showChannelMessage(`Running OverReact Format...`);
        const projectDir = vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders[0].uri.path : "";
        const shouldDetectLineLength = this.config.get('detectCustomLineLength');
        const detectLineLengthFlag = shouldDetectLineLength ? "--detect-line-length" : "";
        const command = `pub run over_react_format ${document.fileName} -p ${projectDir} ${detectLineLengthFlag}`;
        this.showChannelMessage(command);
        let child = child_process_1.exec(command);
        child.stdout.on('data', data => this.channel.append(data.toString()));
        child.stderr.on('data', data => this.channel.append(data.toString()));
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
//# sourceMappingURL=extension.js.map