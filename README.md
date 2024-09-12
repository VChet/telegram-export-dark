## Usage

1. Download one of themes
    - [Aqua](https://download-directory.github.io/?url=https://github.com/VChet/telegram-export-dark/tree/master/styles/aqua)
    - [Cream](https://download-directory.github.io/?url=https://github.com/VChet/telegram-export-dark/tree/master/styles/cream)
    - [Green](https://download-directory.github.io/?url=https://github.com/VChet/telegram-export-dark/tree/master/styles/green)
    - [Red](https://download-directory.github.io/?url=https://github.com/VChet/telegram-export-dark/tree/master/styles/red)
1. Extract archive contents to your `ChatExport` folder
1. Confirm overwriting the original `styles.css` file

## Development

1. Install [Node.js](https://nodejs.org/)
1. 1. Install [pnpm](https://pnpm.io/) `npm install pnpm --global`
1. Install all dependencies using `pnpm install`
1. Add new theme or edit existing ones in the [themes folder](./src/themes/)
1. Add or update [mappings](./src/mappings.js) to replace any other colors
1. Regenerate styles with `pnpm run build`
