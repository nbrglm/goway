# NBRGLM GoWay

A VS Code extension providing opinionated tools and generators for structured Golang projects.  
This extension helps you create standardized API handlers for Golang projects using a predefined template structure.

---

## Features
- Generate standardized Golang API handlers with a single command  
- Includes boilerplate code with proper error handling, transaction management, metrics, and observability  
- Configurable import paths and metrics namespace  
- Mascot/logo assets provided under **CC BY 4.0** (can be used with attribution)  

<img alt="NBRGLM GoWay's Logo" src="https://github.com/nbrglm/goway/raw/main/images/logo.png">

---

## Requirements
- VS Code 1.104.0 or higher  
- A structured Golang project  

---

## Installation

### From VS Code Marketplace
1. Open VS Code  
2. Go to Extensions view (`Ctrl+Shift+X` or `Cmd+Shift+X` on macOS)  
3. Search for **NBRGLM GoWay**  
4. Click **Install**  

---

## Usage

### Generating a New API Handler
1. Open a Go file or folder where you want to create the handler  
2. Open the command palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on macOS)  
3. Type **NBRGLM: New Go API Handler** and select the command  
4. Enter the name of the handler (PascalCase, e.g., `GetUser`)  
5. The extension will generate the handler with proper structure and boilerplate code  

### Generated Handler Features
- Proper package structure  
- Prometheus metrics registration  
- Request/response structs  
- Swagger documentation annotations  
- Context handling with observability  
- Transaction management  
- Error handling  

---

## Extension Settings
This extension contributes the following settings:

- `golangProjectToolsNbrglm.handlers.baseImportPath` – Base import path for your Go project (e.g., `"github.com/username/projectname"`)  
- `golangProjectToolsNbrglm.handlers.metricsNamespace` – Namespace for Prometheus metrics (default: `"myapp"`)  

---

## Example Generated Code
The generated handler follows best practices for API handlers, including metrics, error handling, and transaction management.

---

## Development

### Building the Extension
- Run `npm run build` or `npm run watch:esbuild` to compile  

### Testing the Extension
- Press `F5` to launch the extension in debug mode  
- In the new VS Code window, open a Go project  
- Use the **NBRGLM: New Go API Handler** command to test functionality  

---

## Release Notes
### 0.0.1
- Initial release with Go API handler generation functionality  

---

## License
- **Extension code:** [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0)  
- **Mascot/logo/images:** [Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/)  

> Mascot/logo assets provided under CC BY 4.0. Please give attribution to NBRGLM when using them outside this extension.
