# SimpleNodeAPI

A minimal Node.js REST API built with Express for testing and demonstration purposes.

## Features

- Very simple structure for easy experimentation and learning
- Three built-in endpoints:
  - Health check (`/`)
  - Current server time (`/time`)
  - Environment variable listing (`/envs`)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or above recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/MarlomSouza/SimpleNodeAPI.git
   cd SimpleNodeAPI
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

### Running the Server

Start the server with:

```bash
node index.js
```

By default, the server runs on port `3000`. You can access it at [http://localhost:3000](http://localhost:3000).

---

## API Routes

### 1. Health Check

- **Endpoint:** `GET /`
- **Description:** Returns `"OK"` indicating the server is running.
- **Example Response:**
  ```
  OK
  ```

---

### 2. Get Current Server Time

- **Endpoint:** `GET /time`
- **Description:** Returns the current server time in ISO 8601 format.
- **Example Response:**
  ```json
  {
    "time": "2025-06-27T17:10:22.000Z"
  }
  ```

---

### 3. List Environment Variables

- **Endpoint:** `GET /envs`
- **Description:** Returns all environment variables available to the Node.js process as a JSON object.
- **Example Response:**
  ```json
  {
    "PATH": "...",
    "HOME": "...",
    // and other environment variables
  }
  ```

---

### 4. Static Ingress Test File

- **Endpoint:** `GET /teste-ingress.js`
- **Description:** Returns a small JavaScript file for testing Galaxy ingress redirects.

After deploying to staging, test the normal file URL and then the URL with the container parameter:

```text
https://<app>.stg.galaxycloud-staging.app/teste-ingress.js
https://<app>.stg.galaxycloud-staging.app/teste-ingress.js?_g_container_=undefined&v=123
```

The second request should respond with `303` and `Location: /teste-ingress.js?v=123`. Following that redirect should return `200` with the JavaScript file.

---

## Example Usage

Using `curl`:

- Check health:
  ```
  curl http://localhost:3000/
  ```
- Get time:
  ```
  curl http://localhost:3000/time
  ```
- List environment variables:
  ```
  curl http://localhost:3000/envs
  ```

---

## License

This project is open source and available under the [MIT License](LICENSE).

---

## Author

- [MarlomSouza](https://github.com/MarlomSouza)
