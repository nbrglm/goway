// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import { handlerTemplateString } from './handlerTemplate';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Extension "nbrglm-goway" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	// Add the implementation of the new go api handler command
	const newGoApiHandlerDisposable = vscode.commands.registerCommand('nbrglm-goway.newGoApiHandler', newGoApiHandler);
	context.subscriptions.push(newGoApiHandlerDisposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }

// The new go api handler command
export async function newGoApiHandler() {
	let editor = vscode.window.activeTextEditor;
	if (!editor) {
		vscode.window.showErrorMessage('Open a file first to insert the new Go API handler!');
		return;
	}

	let handlerName = await vscode.window.showInputBox({ prompt: 'Enter the name of the new API handler (e.g., GetUser):' });
	if (!handlerName) {
		vscode.window.showErrorMessage('Handler name is required!');
		return;
	}

	let routePath = await vscode.window.showInputBox({ prompt: 'Enter the route path (e.g., /user):' });
	if (!routePath) {
		vscode.window.showErrorMessage('Route path is required!');
		return;
	}

	// Ensure routePath starts with a slash
	if (!routePath.startsWith('/')) {
		routePath = '/' + routePath;
	}

	let routeMethod = await vscode.window.showQuickPick(['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], { placeHolder: 'Select the HTTP method for the route:' });
	if (!routeMethod) {
		vscode.window.showErrorMessage('HTTP method is required!');
		return;
	}

	// Convert handlerName to UpperCamelCase
	handlerName = handlerName.charAt(0).toUpperCase() + handlerName.slice(1);

	// Convert to lowercase and snake_case
	const snakeName = handlerName
		.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase();

	const config = vscode.workspace.getConfiguration("nbrglm-goway");
	let editorPath = editor.document.uri.path;
	if (editorPath.endsWith('.go') === false) {
		editorPath = "handlers";
	}
	const packageName = path.basename(editorPath, ".go") || 'handlers';

	const baseImportPath = config.get<string>("handlers.baseImportPath") || "github.com/username/projectname";
	const metricsNamespace = config.get<string>("handlers.metricsNamespace") || "myapp";

	// Prepare the handler code by replacing placeholders
	const variables = {
		"{packageName}": packageName,
		"{HandlerName}": handlerName,
		"{handler_name}": snakeName,
		"{baseImportPath}": baseImportPath,
		"{metricsNamespace}": metricsNamespace,
		"{routePath}": routePath,
		"{routeMethodUpper}": routeMethod.toUpperCase(),
		"{routeMethodLower}": routeMethod.toLowerCase(),
	}

	let handlerCode = handlerTemplateString;
	for (const [key, value] of Object.entries(variables)) {
		const regex = new RegExp(key, 'g');
		handlerCode = handlerCode.replace(regex, value);
	}

	const isEmpty = editor.document.getText().length === 0;
	let result: 'Insert at cursor' | 'Replace' | 'Cancel' | undefined;
	if (!isEmpty) {
		result = await vscode.window.showWarningMessage('The current file is not empty. What to do?', 'Replace', 'Insert at cursor', 'Cancel');
	} else {
		result = 'Insert at cursor';
	}

	if (!result || result === 'Cancel') {
		return; // User closed the dialog or cancelled
	}

	// Insert the handler code at the current cursor position
	editor.edit(async editBuilder => {
		switch (result) {
			case 'Replace':
				const zeroPos = new vscode.Position(0, 0);
				new vscode.Position(editor.document.lineCount, 0);
				editBuilder.replace(new vscode.Range(zeroPos, editor.document.positionAt(editor.document.getText().length)), handlerCode);
				return;
			case 'Insert at cursor':
				// Insert at cursor
				const position = editor!.selection.active;
				editBuilder.insert(position, handlerCode);
				return;
			default:
				return; // Do nothing
		}
	}).then(success => {
		if (success) {
			vscode.window.showInformationMessage(`New API handler "${handlerName}" inserted!`);
		} else {
			vscode.window.showErrorMessage('Failed to insert the new API handler!');
		}
	});
}