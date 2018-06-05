# getting-started-nodejs

[![wercker status](https://app.wercker.com/status/7b1a402dd00d57fc9abddf9eb5161675/s "wercker status")](https://app.wercker.com/project/bykey/7b1a402dd00d57fc9abddf9eb5161675)

A sample application in Javascript on NodeJS for Wercker.

This application uses the `node` container obtained from the [Docker Hub](https://hub.docker.com/_/node/)

## Setup
Clone this repo and cd into the directory:

```
git clone https://github.com/wercker/getting-started-nodejs.git
cd getting-started-nodejs
```

## Running
You can run the sample app in a couple of different ways. The first is to simply launch the executable:
```
node app.js
```

Now point your browser at `http://localhost:8080` to see:
```
{"cities":["Amsterdam","Berlin","New York","San Francisco","Tokyo"]}
```

The second, and more useful, way is to use the `wercker dev` command to launch the binary within a Docker container, using the base image defined in the `box/id` property at the top of the `wercker.yml`, like so:
```
wercker dev --expose-ports
```
The `dev` target inside `wercker.yml` uses the `internal/watch` step to dynamically reload the runtime container when sourcefile changes are detected, which allows you to quickly test changes without having to kill/rebuild/relaunch the container. For instance, add another city to the array on `app.js:3' like so:

```
var cities = {"cities":["Amsterdam","Berlin","New York","San Francisco","Tokyo","London"]}
```

and then refresh your browser pointing to `http://localhost:8080` to see:
```
{"cities":["Amsterdam","Berlin","New York","San Francisco","Tokyo","London"]}}
```

---
Sign up for Wercker: http://www.wercker.com

Learn more at: http://devcenter.wercker.com
