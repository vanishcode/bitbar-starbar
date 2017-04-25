#!/usr/bin/env /usr/local/bin/node

/*
# <bitbar.title>StarBar</bitbar.title>
# <bitbar.version>v0.0.1</bitbar.version>
# <bitbar.author>jh</bitbar.author>
# <bitbar.author.github>vanishcode</bitbar.author.github>
# <bitbar.desc>Quick check your Github stars</bitbar.desc>
# <bitbar.image>http://www.hosted-somewhere/pluginimage</bitbar.image>
# <bitbar.dependencies>node,cheerio</bitbar.dependencies>
# <bitbar.abouturl>https:/github.com/vanishcode/bitbar-starbar</bitbar.abouturl>
*/

// Base Dependencies
var request = require('request'),
    cheerio = require('cheerio');

// Import User Setting
require('dotenv').config({ path: __dirname + '/../config.env' });
const username = process.env.GITHUB_USERNAME;
const userUrl = 'http://github.com/' + username;
const compactUI = process.env.COMPACT_UI;

// Detect user's menu bar style
var child_process = require('child_process');
// Assume dark menu bar
var boldColor = 'white';
try {
    child_process.execSync('defaults read -g AppleInterfaceStyle', { stdio: 'ignore' });
} catch (e) {
    // AppleInterfaceStyle not set, thus user has light menu bar style
    boldColor = 'black';
}

// Check to Make Sure User Set Default Configs
if (userUrl === 'http://github.com/<YOUR_GITHUB_NAME_HERE>') {
    console.log('Set the Your Own Configs!');
    process.exit();
}

// Main scarpe and format module
request('http://github.com/' + username, function(error, response, body) {
    if (!error && response.statusCode == 200) {
        var $ = cheerio.load(body);
        //console.log(body)
        var title = [];
        var number = [];
        var total = 0;
        $('span.repo.js-repo').each((i, e) => {
            // console.log($(e).text());
            title.push($(e).text());
        });
        //console.log(title);
        $('span.repo-language-color + a').each((i, e) => {
            // console.log($(e).text().replace(/[ ]/g, "").replace(/[\r\n]/g, ""));
            number.push($(e).text().replace(/[ ]/g, "").replace(/[\r\n]/g, ""));
            total += parseInt($(e).text().replace(/[ ]/g, "").replace(/[\r\n]/g, ""));
        });


        // To Menu Bar
        if (compactUI == 'true') {
            console.log("⭐️ " + total);
            console.log("---")
            for (let i = 0; i < title.length; i++) {
                console.log(title[i] + ': ' + number[i])
            }
        } else {
            console.log("---");
        }
    } else {
        console.log("Error!", error)
    }
});