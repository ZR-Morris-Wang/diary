# HW1
I have completed two of the three perfect requirements (edit date when **creating** new diary and filter), be sure to check them out.

To change date when creating new diary, just simply click on the date. After editing the date, click on somewhere else, if the background of the date became red then the date is invalid. 

To apply filters to the data, just click on the filters at the top of the page under the title.

## API documentation

- GET `/api/diaries`

```json
[
  {
    "id": "69862077-f127-45a0-9cb2-39fa73592aca",
    "date": "YYYY.MM.DD",
    "tag": "tag name",
    "mood": "mood",
    "content": "diary 1 content"
  }
]
```

- GET `/api/diaries/:id`

```json
{
    "id": "69862077-f127-45a0-9cb2-39fa73592aca",
    "date": "YYYY.MM.DD",
    "tag": "tag name",
    "mood": "mood",
    "content": "diary 1 content"
}
```

- POST `/api/diaries`

```json
{
    "date": "YYYY.MM.DD",
    "tag": "tag name",
    "mood": "mood",
    "content": "diary 1 content"
}
```

- PUT `/api/diaries/:id`

```json
{
    "id": "69862077-f127-45a0-9cb2-39fa73592aca",
    "tag": "tag name",
    "mood": "mood",
    "content": "diary 1 content"
}
```

- DELETE `/api/diaries/:id`

```json
{
    "id": "69862077-f127-45a0-9cb2-39fa73592aca",
    "date": "YYYY.MM.DD",
    "tag": "tag name",
    "mood": "mood",
    "content": "diary 1 content"
}
```

## Frontend eslint and prettier Setup

### 1. Create a frontend directory and initialize a new Node.js project for eslint and prettier

```bash
mkdir frontend
cd frontend
yarn init -y
```

### 2. Install eslint and prettier

eslint is a tool for identifying and reporting on patterns found in your code, with the goal of making code more consistent and enforce best practices. On the other hand, prettier code formatter. It only cares about the format but not the logic. However, eslint would also try to fix some minor formatting issues, so we need eslint-config-prettier to disable the eslint rules that may conflict with those of prettier.

```bash
yarn add -D eslint prettier eslint-config-prettier
```

### 4. Install the packages
Enter the following command in your terminal
```bash
yarn
```
### 5. configure eslint and prettier

eslint come with abuilt-in command to create a config file to provide a good starting point. You can run the following command to create a `.eslintrc.js` file. You'll be prompted several questions about your project. For this project, answer these questions like so.

```text
$ yarn eslint --init
You can also run this command directly using 'npm init @eslint/config'.
? How would you like to use ESLint? …
  To check syntax only
❯ To check syntax and find problems # choose this one
  To check syntax, find problems, and enforce code style
? What type of modules does your project use? …
  JavaScript modules (import/export)
  CommonJS (require/exports)
❯ None of these # choose this one
? Which framework does your project use? …
  React
  Vue.js
❯ None of these # choose this one
? Does your project use TypeScript? › No / Yes # choose No
? What format do you want your config file to be in? …
❯ JavaScript # choose this one
  YAML
  JSON
? Where does your code run? …  (Press <space> to select, <a> to toggle all, <i> to invert selection)
✔ Browser # select this one
✔ Node
```

After answering all the questions, you should see a `.eslintrc.js` file in your project directory. Open it and change the `extends` option. The final `.eslintrc.js` would look like this:

```javascript
module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["eslint:recommended", "prettier"], // change this line
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
  },
  rules: {},
};
```

For prettier, create a `.prettierrc.cjs` file in your project directory and add the following lines:

```javascript
module.exports = {};
```

### 6. Add scripts

Add the following lines in `package.json` file:

```json
{
...
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint --fix .",
    "format": "prettier --write ."
  },
...
}
```

Now you can run `yarn lint` to check your code style and `yarn lint:fix` to fix some minor issues. You can also run `yarn format` to format your code.

## Backend eslint and prettier Setup
First, we install the packages. Enter the following command in the terminal.
```bash
yarn
```

The eslint setup step are similar to the frontend setup. The only difference is that you should answer the questions differently when running `yarn eslint --init`.

```text
$ yarn eslint --init
You can also run this command directly using 'npm init @eslint/config'.
? How would you like to use ESLint? …
  To check syntax only
❯ To check syntax and find problems # choose this one
  To check syntax, find problems, and enforce code style
? What type of modules does your project use? …
❯ JavaScript modules (import/export) # choose this one
  CommonJS (require/exports)
  None of these
? Which framework does your project use? …
  React
  Vue.js
❯ None of these # choose this one
? Does your project use TypeScript? › No / Yes # choose No
? What format do you want your config file to be in? …
❯ JavaScript # choose this one
  YAML
  JSON
? Where does your code run? …  (Press <space> to select, <a> to toggle all, <i> to invert selection)
✔ Browser
✔ Node # select this one
```

The prettier setup for backend is different from that of the frontend package. Follow the steps below to setup prettier for backend. We will use "@trivago/prettier-plugin-sort-imports" to sort imports.

### 1. Install prettier and "@trivago/prettier-plugin-sort-imports"

```bash
yarn add -D prettier @trivago/prettier-plugin-sort-imports
```

### 2. Create a `.prettierrc.cjs` file in your project directory and add the following lines:

```javascript
module.exports = {
  plugins: [require.resolve("@trivago/prettier-plugin-sort-imports")],
  importOrder: [
    "^react",
    "^next",
    "<THIRD_PARTY_MODULES>",
    "^@w+\\w",
    "^@\\w",
    "^./",
  ],
  importOrderSeparation: true,
};
```

## Backend Setup

### 1. Create a backend directory and initialize a new Node.js project

```bash
mkdir backend
cd backend
yarn init -y
```

### 2. Add some lines in `package.json`

```json
{
  ...
  "type": "module",
  "scripts": {
    "start": "nodemon index.js",
  },
  ...
}
```


### 3. Install dependencies

```bash
cd backend
yarn add express cors body-parser uuid
```


### 4. MongoDB setup

1. Copy the connection string using 

```bash
cp .env.example .env
```
2. Add the following line in `backend/.env` file

```bash
MONGO_URL=<your connection string>
```

3. Install dependencies

```bash
cd backend
yarn add mongoose
```

4. Add some lines in `.env`
  ```bash
  PORT=8000
  ```
### 5. Run the server

```bash
cd backend
yarn dev
```

If successful, you should see the following message in the terminal:

```bash
Server is running on port http://localhost:8000
```

