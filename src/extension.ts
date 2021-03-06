import * as vscode from 'vscode';
import * as search from './search';

function openDocErrorMessage (str) {
	return vscode.window.showErrorMessage("Error: " + str, "Open Docs").then((item) => {
		if (item === "Open Docs") {
			search.openURL();
		}
	});
}

export function activate(context: vscode.ExtensionContext) {

	//Tell the user the extension has been activated.
	console.log('Corona Tools extension is now active!'); 

	// Open Corona Documentation, when you already have something you want to search selected
	var open_corona_docs = vscode.commands.registerTextEditorCommand("extension.openCoronaDocs",
		(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) => {
				
			// selection[0] is the start, and selection[1] is the end
			let selection = textEditor.selection;
			
			if (!selection.isSingleLine) {
				openDocErrorMessage("Multiple lines selected, please just select a class.");
				return;
			}
			
			// If there is nothing, or the end is before the start
			if (selection.isEmpty) {
				
				openDocErrorMessage("Nothing is selected. Please select a class!");
				return;
			}
			
			//Get the whole line of code with the selection
			let line = textEditor.document.lineAt(selection.start.line).text;
		
			search.openCoronaDocs(line, selection.start.character, selection.end.character)
	});
	context.subscriptions.push(open_corona_docs);
	
	var search_corona_docs = vscode.commands.registerCommand("extension.searchCoronaDocs",()=>{
		vscode.window.showInputBox({
			prompt: "Search the Corona Documentation:"
		}).then((result) => {
			if (result != undefined) {	
				//Use the node module "open" to open a web browser
				search.openURL(result);
			}
		});
	});
	context.subscriptions.push(search_corona_docs);
}