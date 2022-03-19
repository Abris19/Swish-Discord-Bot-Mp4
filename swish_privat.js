var ffmpeg = require('fluent-ffmpeg');
var axios = require('axios');
var inUse = false

const { MessageEmbed, MessageAttachment } = require("discord.js");
const Canvas = require('canvas');

function rnd(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function text(obj, size, color, x, y, font, text) {
	obj.videoFilters({
	  filter: 'drawtext',
	  options: {
		fontfile:font,
		text: text,
		fontsize: size,
		fontcolor: color,
		x: x,
		y: y
	  }
	})
}

module.exports = {
    name: "swish_privat",
    description: "Add Text On MP4",
    options: [
        {
            name: 'name',
            description: 'Name Of The Contact',
            type: 'STRING',
            required: true
        },
        {
            name: 'number',
            description: 'Number Of The Contact',
            type: 'STRING',
            required: true
        },
        {
            name: 'kr',
            description: 'KR',
            type: 'STRING',
            required: true
        }
    ],
    run: async (client, interaction, args) => {
		if(interaction.channel.name.search("command") == -1)
		{
			interaction.editReply({ embeds: [ new MessageEmbed().setAuthor({ name: 'Du måste vara i bot-commands för att använda botten!', iconURL: 'https://emoji.gg/assets/emoji/5316_Error_512x512_by_DW.png' })]});
			return;
		}
		if(inUse == true)
		{
			interaction.editReply({ embeds: [ new MessageEmbed().setAuthor({ name: 'Prova igen om några sekunder!', iconURL: 'https://emoji.gg/assets/emoji/5316_Error_512x512_by_DW.png' })]});
			return;
		}
		inUse = true;
        interaction.editReply({ embeds: [ new MessageEmbed().setAuthor({ name: 'Genererar...', iconURL: 'https://cdn.discordapp.com/emojis/821266152785313793.gif?size=96&quality=lossless' })]});
        const name = interaction.options.getString('name');
        const number = format_number(interaction.options.getString('number'));
        const kr = interaction.options.getString('kr');
        
        function getDate() {
            const months = ['jan.', 'feb.', 'mar.', 'apr.', 'may', 'jun.', 'jul.', 'aug.', 'sep.', 'nov.', 'dec.'];
            const date = new Date(Date.now());
            const days = date.getDate();
            const month = months[date.getMonth()];
            const date2 = new Date(date.toLocaleString('en-US', { timeZone: 'CET' }));
            return `${days} ${month} ${date.getFullYear()}, kl ${date2.getHours()}.${date2.getMinutes()}`;
        }
		function format_number(p1) {
			if(p1.length == 10)
			{
				if(p1.substring(0, 2) == "07")
					return `+46 ${p1.substring(1, 3)} ${p1.substring(3, 6)} ${p1.substring(6, 8)} ${p1.substring(8, 10)}`;
				else if(p1.substring(0, 3) == "123")
					return `${p1.substring(0, 3)} ${p1.substring(3, 6)} ${p1.substring(6, 8)} ${p1.substring(8, 10)}`;
			}
			return p1
		}

        async function write() {
            // make sure you set the correct path to your video file
			var proc = ffmpeg('./swishgood.mp4')
			text(proc, 35, '#969696', '(main_w/2-text_w/2)', 1000, 'MuseoSansRounded300.otf', getDate());

			text(proc, 55, '#ffffff', '(main_w/2-text_w/2)', 1100, 'MuseoSansRounded300.otf', name);

			text(proc, 39, '#696C6D', '(main_w/2-text_w/2)', 1165, 'MuseoSansRounded300.otf', format_number(number));

			text(proc, 95, '#ffffff', '(main_w/2-text_w/2)', 1295, 'MuseoSansRounded300.otf', kr + " kr");
			
			proc.on('end', function () {
				interaction.editReply({ embeds: [ new MessageEmbed().setAuthor({ name: 'Laddar up..', iconURL: 'https://cdn.discordapp.com/emojis/821266152785313793.gif?size=96&quality=lossless' })]});
				interaction.channel.send({ files: ["./out.mp4"] });
				inUse = false;
			})
			proc.on('error', function (err) {
				console.log('an error happened: ' + err.message);
				inUse = false;
			})
			// save to file
			proc.save('./out.mp4');
        }
        write()
    }
}