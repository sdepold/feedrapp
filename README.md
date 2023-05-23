# Welcome

## Introduction

Feedr is a service for parsing RSS and Atom feeds. You just pass the URL
of an RSS/Atom feed and the service will return the parsed feed as JSON.
Feedr was originally designed as a drop-in replacement for Google's Feed
API, which has been deprecated and taken offline on December 15th, 2016.

## Usage

Feedr has to be requested with the query parameter `q` that contains the URL of the to-be-parsed RSS/Atom feed. An example request looks like this:

```sh
curl \
  -H 'Accept: application/json' \
  'https://www.feedrapp.info/api/?q=https://bitte.kaufen/magazin/feed/'
```

## Options

In addition to the `q` parameter, Feedr supports other optional parameters.

| Parameter | Description                                                                                                                                                                                                                                                                                                   | Examples                         |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| callback  | Wraps the answer in a function call, which makes it compatible to JSONP calls                                                                                                                                                                                                                                 | callback=callback123456789       |
| num       | Number of entries to load. Defaults to 4.                                                                                                                                                                                                                                                                     | num=15                           |
| encoding  | The text encoding of the to be parsed feed. Defaults to "utf8". Find supported values [here](https://github.com/ashtuchkin/iconv-lite/wiki/Supported-Encodings).                                                                                                                                              | encoding=ISO-8859-1              |
| order     | Specifies the order of entries. By default there is no ordering happening and the entries are kept in the order of the original RSS feed. The order can be overridden by providing any of the entry's fields (e.g. publishedDate, title, …). In order to reverse the order, just prefix the field with a `-`. | order=title order=-publishedDate |

## Run it yourself

You can create your own copy of FeedrApp using the button below :)

[![Deploy your own FeedrApp copy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsdepold%2Ffeedrapp)

## Hosting

The hosting is powered and sponsored by Vercel. Thanks!

<a href="https://vercel.com?utm_source=feedr-app&utm_campaign=oss" target="_blank">
    <img src="https://images.ctfassets.net/e5382hct74si/78Olo8EZRdUlcDUFQvnzG7/fa4cdb6dc04c40fceac194134788a0e2/1618983297-powered-by-vercel.svg" height="32">
</a>

## Local development

The following instructions outline the installation and bootup process on your local development machine.
You will need Node.JS (e.g. version 18) and Yarn installed.

```sh
# Clone the repo
git clone https://github.com/sdepold/feedrapp.git

# Enter the directory
cd feedrapp

# Install dependencies
yarn

# Run the app in development mode
yarn dev

# To create and start a "production" build, run the following commands
yarn build
yarn start
```

After starting the app either in development or production mode, you can open http://localhost:3000 to visit the page.

You can see the parsing results through http://localhost:3000/api/?q=https://bitte.kaufen/magazin/feed/

## License

MIT
