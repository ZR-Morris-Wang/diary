# HW1
To change date when creating new diary, just simply click on the date. After editing the date, click on somewhere else, if the background of the date became red then the date is invalid. 

To apply filters to the data, just click on the filters at the top of the page under the title.



## Run Backend

### 1. Create a backend directory and initialize a new Node.js project

```bash
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

I have provided my mongoDB plan for you to use.

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

