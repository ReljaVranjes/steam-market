const Discord = require('discord.js');
const bot = new Discord.Client();
const puppeteer = require('puppeteer');
const { prefix, token } = require('./config.json');


async function a(url) {
    const browser = await puppeteer.launch({headless:false});
    const page = await browser.newPage();
    await page.goto(url);


    bot.on('message', async message => {
        
        if (!message.content.startsWith(prefix) || message.author.bot) return;

        const args = message.content.slice(prefix.length)
        await page.type('input[id = "findItemsSearchBox"]', args);
        await Promise.all([
            page.waitForNavigation(),
            page.keyboard.press('Enter')

        ]);
        message.channel.send("Searching...")

        var error = await page.evaluate(() => {
            x = document.getElementsByClassName("market_listing_table_message").length;
            if (x == 0) {
                return ("nema")
            }
        
            if (x == 1) {
                return ("ima")
            }

        });

        if (error == "ima") {
            message.channel.send("Please try again, I couldn't find any results")
            let searchInput = await page.$('input[id="findItemsSearchBox"]');
            await searchInput.click({ clickCount: 3 });
            await searchInput.press('Backspace');
        }

        else if (error == "nema") {
            var slika = await page.evaluate(() => { var x = document.getElementById("result_0_image").src; return (x) });
            let order = await page.$('div[class = "market_listing_right_cell market_listing_their_price market_sortable_column"')
            await order.click({ clickCount: 1 })
            const page1 = await browser.newPage()
            await page1.goto("https://csgostash.com/")
            await page1.click('button[class = "btn btn-default mobile-search-button visible-xs visible-sm"]')
            await page1.type('input[id = "navbar-search-input"', args)
            await Promise.all([
                page1.waitForNavigation(),
                page1.keyboard.press('Enter')

            ]);
            var uuu = await page1.evaluate(() => { var x = document.getElementsByClassName("gs-title")[1].href; return (x); });
            await page1.goto(uuu);
            var imeop = await page1.evaluate(() => { var y = document.getElementsByClassName("nomargin")[1].innerText; return (y); });
            await page1.close();
            

            var ime = await page.evaluate(() => {

                var imena = [];

                for (var i = 0; i < document.getElementById("searchResults_end").textContent; i++) {

                    imena.push(document.getElementsByClassName("market_listing_item_name")[i].innerHTML);

                }


                return (imena)
            });

            var cijena = await page.evaluate(() => {

                var cijene = [];
                for (var i = 1; i < document.getElementById("searchResults_end").textContent * 2; i += 2) {

                    cijene.push(document.getElementsByClassName("normal_price")[i].textContent);
                }

                return (cijene)
            });

            var embed = new Discord.MessageEmbed()
                .setTitle('Link to Steam page')
                .setURL(page.url())
                .setAuthor(imeop,"https://steamuserimages-a.akamaihd.net/ugc/933807557811000159/B8936CF76AEA207839139E32593F7FA0C4AEC4C9/")
                .setThumbnail(slika)

            if (imeop.startsWith("Consumer")) {
                embed.setColor("#c5d3d6")
            }
            else if (imeop.startsWith("Industrial")) {
                embed.setColor("#6dadcf")
            }
            else if (imeop.startsWith("Mil")) {
                embed.setColor("#166df0")
            }
            else if (imeop.startsWith("Restricted")) {
                embed.setColor("#a55bf5")
            }
            else if (imeop.startsWith("Classified")) {
                embed.setColor("#a041f2")
            }
            else if (imeop.startsWith("Contraband")) {
                embed.setColor("#f2b527")
            }
            else { embed.setColor("ed4e4e") }


            for (var i = 0; i < ime.length; i++) {
                embed.addFields({ name: "Item " + (i + 1), value: ime[i] + " - " + cijena[i].slice(0, -3) })
            }

            message.channel.send(embed);
           

            let searchInput = await page.$('input[id="findItemsSearchBox"]');
            await searchInput.click({ clickCount: 3 });
            await searchInput.press('Backspace');
        }

    });

}
bot.login(token);

a("https://steamcommunity.com/market/");
bot.on('ready', () => {
    bot.user.setPresence({
        game: {
            name: '$skin'
        }});
    console.log('Ready!');
    
});
