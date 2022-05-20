const PORT = 8000;
/** To use the installed packages we need to require them */
const axios = require("axios");
const cheerio = require("cheerio");
const { response } = require("express");
const express = require("express");

const fs = require('fs');
const writeStream = fs.createWriteStream('post.csv');

/** Write Headers */
writeStream.write(`AppName,Data\n`);

/** To use Express, once required, we must call it */
const app = express();

const urls = [
    "https://apps.apple.com/es/app/whatsapp-messenger/id310633997",
    "https://apps.apple.com/es/app/gmail-el-correo-de-google/id422689480",
    "https://apps.apple.com/es/app/microsoft-outlook/id951937596",
    "https://apps.apple.com/es/app/discord-chatea-habla-y-une/id985746746",
    "https://apps.apple.com/es/app/telegram-messenger/id686449807",
    "https://apps.apple.com/es/app/instagram/id389801252",
    "https://apps.apple.com/es/app/facebook/id284882215",
    "https://apps.apple.com/es/app/tiktok-videos-m%C3%BAsica/id835599320",
    "https://apps.apple.com/es/app/linkedin-b%C3%BAsqueda-de-empleo/id288429040",
    "https://apps.apple.com/es/app/snapchat/id447188370"
];

/** Axios works passing through an url and it visits the url and then we get the response from it.
 * Then, we save the response in some html that we can work with */
for(let i = 0; i < urls.length; i++) {
    axios(urls[i])
    .then((response) => {
        /** In this way we are going to print on terminal all that axios has given us, that is all the html of the page indicated by url */
        const html = response.data;

        /** We can pick up some specific path with Cheerio.
         * load will allow us to pass through the html */
        const $ = cheerio.load(html);

        /** Array for saving each item we will get from the html */
        const items = [];
        let appName;
        let name = "NULL";
        let value = "NULL";

        /** Now we are going to pick up from the html whatever class is specificied after the dot sign.
         * For each item, we want to get that item and grab its text */
        $(".privacy-type__data-category-heading", html).each(function () {

            /** Code to get app's name from its url */
            appName = urls[i].substring(30);
            appName = appName.substring(0, appName.indexOf("/"));
            if(appName.includes("-"))
                appName = appName.substring (0, appName.indexOf("-"));

            const data = $(this).text();

            /** Creation of the object composed by data, and insertion in the array */
            items.push({
                appName,
                data,
            });
            
            name = appName;
            value = data;
            /** Write Row To CSV */
            writeStream.write(`${name},${value}\n`);
        });
        console.log(items);
    })
    .catch((err) => console.log(err)); /** To catch errors and print them out */

    /** Delay to avoid blocking of GET requests */
    var delayInMilliseconds = 1000; //1 second
    setTimeout(function() {
    /** Your code to be executed after 1 second */
    }, delayInMilliseconds);
}

/** To listen out to the PORT using Express.
 * If our server is running correctly on the specified port, we print the following message in the console */
app.listen(PORT, () => console.log("server running on PORT ${PORT}"));
