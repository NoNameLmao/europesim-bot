import { Client, Message, MessageEmbed } from 'discord.js';
import { getRandomArbitrary, jsonRead } from 'emberutils';
import { Config } from '../interfaces';
import { Command } from './-handler'

module.exports = {
    name: 'esim',
    aliases: [],
    description: 'Command category for Europesim. Run this command for more information.',
    async run(message: Message, args: string[]) {
        const config = await jsonRead('./config.json') as Config,
            nowUTC = new Date().getUTCHours(),
            europesimStartDate = Date.parse(config.europesimStartDate),
            currentDate = Date.now(),
            differenceInDays = (currentDate - europesimStartDate) / (1000 * 3600 * 24),
            europesimCurrentYear = (Math.floor(config.europesimStartYear + differenceInDays)),
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            europesimCurrentMonth = months[Math.floor(nowUTC / 2)],
            guildID = '846807940727570433',
            guild = await message.client.guilds.fetch(guildID),
            userCount = guild.members.cache.filter(member => !member.user.bot).size,
            memberCount = guild.memberCount,
            botCount = memberCount - userCount,
            onlineUsers = guild.members.cache.filter(member => member.presence?.status !== 'offline' && !member.user.bot).size;
        if (!args[0]) {
            const esimEmbed = new MessageEmbed()
            .setTitle('Command category: Europesim')
            .setDescription(`Usage: ${config.prefix}esim (command)\n<> = Optional argument(s)`)
            .setColor(message.member.displayHexColor)
            .setFooter({ text: 'https://ourworldofpixels.com/europesim' })
            .addFields(
                {
                    name: 'info',
                    value: 'Shows information, duh',
                    inline: true
                },
                {
                    name: 'roll <country>',
                    value: 'Literally rng but for europesim (1-20)',
                    inline: true
                }
            );
            await message.channel.send({ embeds: [esimEmbed] });
            return;
        } else if (args[0] === 'info') {
            try {
                const infoEmbed = new MessageEmbed()
                .setTitle('esim info')
                .setDescription('Europesim information')
                .setAuthor({
                    name: 'Bot information',
                    iconURL: 'https://cdn.discordapp.com/icons/846807940727570433/4bbf13c1ce8bfb351fc7eafdc898e7d1.png'
                })
                .setColor(message.member.displayHexColor)
                .setFooter({ text: 'https://ourworldofpixels.com/europesim' })
                .addFields(
                    {
                        name: 'Current UTC hour',
                        value: `${nowUTC}`,
                        inline: true,
                    },
                    {
                        name: 'Europesim year, month',
                        value: `${europesimCurrentYear}, ${europesimCurrentMonth}`,
                        inline: true,
                    },
                    {
                        name: 'Europesim\'s server member count',
                        value: `${userCount} users + ${botCount} bots = ${memberCount} overall. Online users: ${onlineUsers}`,
                    },
                );
                await message.channel.send({ embeds: [infoEmbed] });
            } catch (error) {
                message.react('❌');
                await message.channel.send(`❌ error\n\`\`\`js\n${error}\`\`\``);
                return;
            }
        } else if (args[0] === 'roll') {
            let roll = getRandomArbitrary(1, 20);
            if (roll === 0) {
                roll = getRandomArbitrary(1, 20);
                await message.channel.send('got a 0 for some reason, rerolling automatically');
                if (args[1]) {
                    if (roll === 20) await message.channel.send(`\`${args[1]}\` rolled a \`${roll}\` :L`);
                    else await message.channel.send(`\`${args[1]}\` rolled a \`${roll}\``);
                } else await message.channel.send(`rolled a \`${roll}\``);
            } else if (args[1]) {
                if (roll === 20) await message.channel.send(`\`${args[1]}\` rolled a \`${roll}\` :L`);
                else await message.channel.send(`\`${args[1]}\` rolled a \`${roll}\``);
            } else await message.channel.send(`rolled a \`${roll}\``);
        }
    }
} as Command;