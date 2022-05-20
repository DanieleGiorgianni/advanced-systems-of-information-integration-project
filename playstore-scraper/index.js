const PORT = 8000;
/** To use the installed packages we need to require them */
const axios = require("axios");
const cheerio = require("cheerio");
const { createHash } = require("crypto");
const { response } = require("express");
const express = require("express");

/** Array with keywords to find in the HTML page */
//const keys = [" contact", " correo", " ubicación", " pago", " búsqueda", " error", " foto", " teléfono", " uso", " idioma", " dirección IP"];
const keys = [" contact", " email", " location", " pay", " search", " error", " photo", " address book", " use", " language", " IP address"];

const fs = require('fs');
const writeStream = fs.createWriteStream('post.csv');

/** Write Headers */
writeStream.write(`${keys}\n`);

/** To use Express, once required, we must call it */
const app = express();

/** Array containing the urls to be used to get what user data the apps use */
const urls = [
    "https://www.whatsapp.com/legal/privacy-policy-eea?lang=en",
    "https://policies.google.com/privacy",
    "https://privacy.microsoft.com/en-us/privacystatement",
    "https://discord.com/privacy",
    "https://telegram.org/privacy",
    "https://help.instagram.com/519522125107875/",
    "https://www.facebook.com/about/privacy",
    "https://www.tiktok.com/legal/privacy-policy-eea",
    "https://www.linkedin.com/legal/privacy-policy",
    "https://snap.com/en-US/privacy/privacy-policy"
];

/** Array containing classes of the various pages from which information can be obtained.
 * Elements ordered using urls order */
const htmlClasses = [
    "._8l_f",   // WhatsApp div class
    ".nrAB0c",  // Gmail div class
    ".div_content",   // Outlook div class
    ".document-25D7S4", // Discord div class
    ".tl_page", // Telegram div class
    ".gh1tjcio", // Instagram div class (Does not work cause of url [empty result])
    "._xpr",   // Facebook div class (Dose not work so good [few words found even though present])
    ".jsx-526282746",   // TikTok div class
    ".standalone-list", // Linkedin ol class
    ".RichTextBodyContainer-sc-1mnh17e", // Snapchat div class
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

        /** Array of 11 elements (true or false) like DatosDeUsuarios's privacy options */
        let data = [];
        
        let text;

        /** Loop that allows us to check for the class specified by urlClasses 
         * whether or not each of the keys elements is present in the current url */
        for (let j = 0; j < 11; j++) {
            $(htmlClasses[i], html).each(function () {
                text = $(this).text();
                if (text.includes(keys[j])) {
                    data[j] = "TRUE";
                }
                else if (data[j] == null){
                    data[j] = "FALSE";
                }
            });
        }
        console.log(urls[i]);
        console.log(data);

        /** Write Row To CSV */
        writeStream.write(`${data}\n`);
    })
    .catch((err) => console.log("ERROR" + err)); /** To catch errors and print them out */

    /** Delay to avoid blocking of GET requests */
    var delayInMilliseconds = 1000; //1 second
    setTimeout(function() {
    /** Your code to be executed after 1 second */
    }, delayInMilliseconds);
}

/** To listen out to the PORT using Express.
 * If our server is running correctly on the specified port, we print the following message in the console */
app.listen(PORT, () => console.log("server running on PORT ${PORT}"));
