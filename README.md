# LogDog VSCode Extension

Version 1.0.0 coming soon! 🚀<br>
Feel free to contribute to the project by submitting a pull request or opening an issue.

## What is it? 🔎

LogDog is a prototyping and debugging extension for Visual Studio Code. The extension runs [Vanilla JavaScript](https://www.javatpoint.com/what-is-vanilla-javascript) with instant feedback. Runtime values are cached and displayed in your editor, inline with your code, each time you save. LogDog makes testing JavaScript blazingly fast. This extension is essentially a free, open-source, and less complex version of [Quokka.js](https://marketplace.visualstudio.com/items?itemName=WallabyJs.quokka-vscode) or [Console Ninja](https://marketplace.visualstudio.com/items?itemName=WallabyJs.console-ninja). For additional functionality and a better user-experience, I still recommend using [Quokka](https://marketplace.visualstudio.com/items?itemName=WallabyJs.quokka-vscode), but for those looking for an easy-to-use alternative, look no further! <br>
<br>

## Evaluate JavaScript in your editor 🧮

![logStrings](https://github.com/NickMezacapa/logdog-vscode/blob/main/assets/logStr.gif)
<br>
<br>

![addNums](https://github.com/NickMezacapa/logdog-vscode/blob/main/assets/addNums.gif)
<br>
<br>

## Works with ES6 syntax ✅

![es6Function](https://github.com/NickMezacapa/logdog-vscode/blob/main/assets/es6func.gif)
<br>
<br>

## How does it work? 🤔

The extension scans your text document for all functions and console.log expressions in the current file on each save. It uses node inspector debugger to evaluate the code within the context of the current file. The extension then caches the runtime values of each function and console.log expression and displays them in your editor as a vscode text decoration, inline with your code. By default, the text decoration is only displayed for a short interval so as to not pollute the workspace with too much noise, however this is customizable. The cache is used so that the debugger doesn't have to run expensive transactions on every save for the same code. <br>
<br>

# Customization 🎨

LogDog can be customized to your liking. The following settings are available:
- Text color of the log message or function value.
- Log expressions and function evaluations can have different colors.
- Message visibility duration. (how long the text decoration is displayed for)
- Message visibility duration can be different for log expressions and function evaluations.
- User can choose to not display log messages and only display function evaluations, and vice versa.<br>
<br>

Customizations can be made in User/Workspace Settings. To open vscode settings:

- Press `cmd + ,` on Mac
- Press `ctrl + ,` on Windows

Or navigate using the menu bar on Mac:
`Code > Preferences > Settings`
Or on Windows:
`File > Preferences > Settings`

Once you are in settings, click on `Extensions` under User/Workspace and scroll down to `Inline Logger`.

If you wish for further customizations to be implemented, please open a new issue!<br>
<br>

## How to use? 📖

LogDog is easy to use. Simply install the extension from the vscode marketplace and start prototyping! LogDog will work right out of the box after installation. In a Vanilla JavaScript file, type `console.log` and then type a value, or create a function and call that function somewhere in your code. Save the file and the value will be displayed in your editor. <br>
<br>

## How to contribute? 🤝

If you would like to contribute to the project, please submit a pull request or open an issue. I am open to all suggestions and feedback, and I will try my best to get back to you as soon as possible. <br>
<br>

## License 📜
LogDog is licensed under the MIT License. See the LICENSE file for more information. Feel free to use the code in your own projects. <br>
<br>

## Credits 🙏
- [Quokka.js](https://marketplace.visualstudio.com/items?itemName=WallabyJs.quokka-vscode) for the inspiration and the idea.
- [Console Ninja](https://marketplace.visualstudio.com/items?itemName=WallabyJs.console-ninja) for the inspiration and the idea.
- [Node Inspector](https://github.com/node-inspector/node-inspector)
