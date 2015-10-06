/**
 * KBot -- Commands: Module
 * @author Kali@F-List.net
 */

/// <reference path="../bot.d.ts" />
/// <reference path="interfaces.ts" />

module KBot {
	export module Commands {
		export const whitelist = [
			'Kali',
			'Kira',
			'Nickie Lavender'
		]; 

		export const help: ICommand = {
			arguments: [
				{
					name: 'command',
					type: String,
					required: false
				}
			],
			help: 'Gives you either a command listing or a command\'s' +
			' description and syntax.',
			func: function(arguments: string[]): void {
				const command = arguments[0];
				var output = '';
				var params: ICommandArgument[];
				var param: ICommandArgument;
				var paramType: string;

				if (!command) {
					output += `Commands: [${CommandKeys.join(', ') }]`;
					_respond(this.channel, output);
					return;
				}

				params = Commands[command].arguments;

				if (!Commands[command]) {
					_respond(this.channel, 'This command does not exist.');
					return;
				}

				output += `[b]Syntax[/b]: !${command} `;

				if (params) {
					for (let i = 0, ii = params.length; i < ii; i++) {
						param = params[i];
						paramType = _typeToString(param.type);

						output += ` ${param.name}[${
						paramType + (!param.required ? ':optional' : '')
						}]`;
					}
				}

				output += `\n[b]Description[/b]: [i]${Commands[command].help}[/i]`;

				_respond(this.channel, output);
			}
		}

		export const daysToMinutes: ICommand = {
			arguments: [
				{
					name: 'days',
					type: Number,
					required: true
				}
			],
			help: 'Return the sum of minutes for the given number of days.',
			func: function(days: number): void {
				_respond(this.channel, days * 24 * 60 + '');
			}
		}

		export const evaljs: ICommand = {
			arguments: [
				{
					name: 'expression',
					type: String,
					required: true
				}
			],
			help: 'Evaluates a line of JavaScript.',
			func: function(input: string[]): void {
				var _input = input.join(' ')
					.replace(/&lt;/g, '<')
					.replace(/&gt;/g, '>');

				if (whitelist.indexOf(this.user) === -1) {
					_respond(this.channel, 'Must construct additional pylons.');
					return;
				}

				try {
					_respond(this.channel, (eval(_input)) + '');
				} catch (error) {					
					_respond(this.channel, error);
				}
			}
		}

		export const nickname: INicknameCommand = {
			nicknames: null,
			nicknamesKey: null,
			help: 'Gives you a nickname you will be known as to the bot!',
			func: function(days: number): void {
				const nickPrefix = Dictionary.Nicknames.nickPrefix;
				const nickSuffix = Dictionary.Nicknames.nickSuffix;
				const key = nickname.nicknamesKey.indexOf(this.user);
				const randomKeyOne = ~~(Math.random() * nickPrefix.length);
				const randomKeyTwo = ~~(Math.random() * nickSuffix.length);
				var nick = nickPrefix[randomKeyOne] + nickSuffix[randomKeyTwo];

				_respond(this.channel,
					`${_getDisplayName(this.user) } is now known as: [b]${nick}[/b].`
				);

				if (nick.indexOf('the ') === 0) {
					nick = nick.substr(4);
				}

				if (key !== -1) {
					nickname.nicknamesKey.splice(key, 1);
					nickname.nicknames.splice(key, 1);
				}

				nickname.nicknames.push(nick);
				nickname.nicknamesKey.push(this.user);

				localStorage['nicks'] = JSON.stringify(nickname.nicknames);
				localStorage['nicksKey'] = JSON.stringify(nickname.nicknamesKey);
			}
		}

		export const porn: ICommand = {
			help: 'Gives you some random porn from e621. Enjoy.',
			func: function(): void {
				const max = 736510;
				var out = `[url=https://e621.net/post/show/%s]Enjoy, ${
					_getDisplayName(this.user)
					}[/url]`;

				out = out.replace(/\%s/g, '' + ~~(Math.random() * max));
				_respond(this.channel, out);
			}
		}

		export const dice: ICommand = {
			help: 'Rolls some adult dice. The number of faces these things ' +
			'have is crazy.',
			func: function(): void {
				const dieOne = Dictionary.Dice.dieOne;
				const dieTwo = Dictionary.Dice.dieTwo;
				const dieOneResult = ~~(Math.random() * dieOne.length);
				const dieTwoResult = ~~(Math.random() * dieTwo.length);
				var out = `[b]${_getDisplayName(this.user)}[/b] rolls ` +
					`[b]${dieOneResult}[/b]:([i]${dieOne[dieOneResult]}[/i]) and ` +
					`[b]${dieTwoResult}[/b]:([i]${dieTwo[dieTwoResult]}[/i]).`;

				_respond(this.channel, out);
			}
		}

		export const icebreak: ICommand = {
			help: 'Gives you a [b][i]good[/i][/b] icebreaker!',
			func: function(days: number): void {
				const templates = [`Hey ${_getDisplayName(this.user) }, I heard you like some [naughties] with your [innocent].`, 'You\'re not going to believe how many [naughties] the average [innocent] contains.', 'Is it hot in here, or is my [naughty] just completely covered in [naughties]?', 'I can see you\'re not one of those \'[innocent]\' people who are super-concerned about [naughties].', `Listen ${_getDisplayName(this.user) } -- my daughter needs [naughties] real bad.`, 'Can you see my [naughties] through these jeans? No? How about now?', 'Let\'s talk about [naughties].', 'Your [naughties] are so fucking sexy! They look just like my mom\'s.', `You know what I like in ${_getDisplayName(this.user) }? My [naughty].`, 'My friends bet I couldn\'t [naughtyAction] the prettiest girl. Wanna use their money to buy [naughties]?', '[naughties] are my second favourite thing to eat in bed.', 'I don\'t believe in [naughty] at first sight, but I\'m willing to make an exception in your case.', `Damn ${_getDisplayName(this.user) } -- your [naughtyThing] is bigger than my future!`, 'Of all your beautiful curves, your [naughtyThing] is my favourite.', `Damn ${_getDisplayName(this.user) } -- you\'re cute! Let me at your [naughties].`, 'I\'m no weatherman, but you can expect a few inches of [naughty] tonight.', `Well, well, well. If it isn\'t ${_getDisplayName(this.user) }, the person who [naughtyActioned] the last [naughty]!`, 'Sit back, relax, and allow me to explain the importance of [naughties].', 'The more you scream, the more it\'s going to [naughtyAction] you.', 'I don\'t really see why we need paint brushes when we have [naughties].', 'What\'s your dream [naughty]?', 'My doctor says I\'m lacking [naughties].', 'I\'m no organ donor but I\'d be happy to give you my [naughty].', 'I\'m not staring at your boobs. I\'m staring at your [naughty].', 'There are people who say Disneyland is the happiest place on Earth. Apparently none of them have ever been in your [naughty].', 'I wanna live in your [naughties] so I can be with you every step of the way.', 'Do you know what my [naughty] is made of? Boyfriend material.', 'Are you a camera? Because every time I look at you, I want to whip out my [naughty].', 'I\'m not a photographer, but I can picture your [naughties] and my [naughty] together.', 'So, I\'m like, \'I\'ll show you who\'s afraid of [naughtyActioning] all the [naughties]\'!', '[naughtyAction] me if I\'m wrong, but [naughties] still exist, right?', 'Excuse me, but does this smell like [naughty] to you?', 'I didn\'t know that [naughties] could fly so low!', `You know, ${_getDisplayName(this.user) } says I\'m afraid of [naughtyActioning]... want to help prove them wrong?`];
				const naughtyAction = Dictionary.Icebreak.naughtyAction;
				const naughtyActioned = Dictionary.Icebreak.naughtyActioned;
				const naughtyActioning = Dictionary.Icebreak.naughtyActioning;
				const naughtyThing = Dictionary.Icebreak.naughtyThing;
				const naughtyThings = Dictionary.Icebreak.naughtyThings;
				const naughty = Dictionary.Icebreak.naughty;
				const naughties = Dictionary.Icebreak.naughties;
				const innocent = Dictionary.Icebreak.innocent;
				const innocents = Dictionary.Icebreak.innocents;
				const template = templates[~~(Math.random() * templates.length)];
				var output = template;
				var roll: number;

				function getRandom(template: string[]): string {
					const random = ~~(Math.random() * template.length);
					return template[random];
				}

				while (/\[(naughty|naughties|innocent|innocents|naughtyThing|naughtyAction|naughtyActioning)\]/g.test(output)) {
					output = output.replace('[naughty]', getRandom(naughty))
						.replace('[naughties]', getRandom(naughties))
						.replace('[innocent]', getRandom(innocent))
						.replace('[innocents]', getRandom(innocents))
						.replace('[naughtyThing]', getRandom(naughtyThing))
						.replace('[naughtyAction]', getRandom(naughtyAction))
						.replace('[naughtyActioning]', getRandom(naughtyActioning))
						.replace('[naughtyActioned]', getRandom(naughtyActioned));
				}


				output = output.charAt(0).toUpperCase() + output.slice(1, output.length);

				_respond(this.channel, output);
			}
		}
		
		export const adlib: ICommand = {
			arguments: [
				{
					name: 'Sub-command',
					type: String,
					required: true
				}
			],
			help: 'Parse an adlib! Note that \'-n\' means [i]naughty versions[/i].' +
				' Valid adlibs:\n [noun], [nouns], [nouner], [verb], [verbing], ' +
				'[verbs], [verbed], [interjection], [adverb], [adjective]',
			func: function(input: string[]): void {
				const me = _getDisplayName(this.user);
				const adjectives = Dictionary.Adlib.adjectives;
				const verb = Dictionary.Adlib.verb;
				const verbs = Dictionary.Adlib.verbs;
				const verbing = Dictionary.Adlib.verbing;
				const verbed = Dictionary.Adlib.verbed;
				const bodypart = Dictionary.Adlib.bodypart;
				const bodyparts = Dictionary.Adlib.bodyparts;
				const bodyfluid = Dictionary.Adlib.bodyfluid;
				const bodyfluids = Dictionary.Adlib.bodyfluids;
				const noun = Dictionary.Adlib.noun;
				const nouns = Dictionary.Adlib.nouns;
				var userInput = input.join(' ');
				var arrayInput = userInput.split('[');
				var arrayItemArray: string[];
				var arrayItem: string;
				var identifiers: string[];

				function getRandom(list: string[]): string {
					return list[~~(Math.random() * list.length)];
				}

				for (let i = 0, ii = arrayInput.length; i < ii; i++) {
					arrayItemArray = arrayInput[i].split(']');
					
					if (arrayItemArray.length === 1) {
						continue;
					}

					arrayItem = arrayItemArray[0];

					identifiers = arrayItem.split('|');

					arrayItemArray[0] = getRandom(identifiers);

					arrayInput[i] = arrayItemArray.join(']'); 
				}

				userInput = arrayInput.join('[');

				while (/(\[adjective\]|\[me\]|\[verb\]|\[verbs\]|\[verbed\]|\[verbing\]|\[bodypart\]|\[bodyparts\]|\[bodyfluid\]|\[bodyfluids\]|\[noun\]|\[nouns\])/gi.test(userInput)) {
					userInput = userInput
						.replace(/\[adjective\]/, getRandom(adjectives))
						.replace(/\[verb\]/, getRandom(verb))
						.replace(/\[verbs\]/, getRandom(verbs))
						.replace(/\[verbed\]/, getRandom(verbed))
						.replace(/\[verbing\]/, getRandom(verbing))
						.replace(/\[bodypart\]/, getRandom(bodypart))
						.replace(/\[bodyparts\]/, getRandom(bodyparts))
						.replace(/\[bodyfluid\]/, getRandom(bodyfluid))
						.replace(/\[bodyfluids\]/, getRandom(bodyfluids))
						.replace(/\[noun\]/, getRandom(noun))
						.replace(/\[nouns\]/, getRandom(nouns))
						.replace(/\[me\]/, me);
				}

				_respond(this.channel, userInput);
			}
		}
	}

	void function() {
		Commands.nickname.nicknames = JSON.parse(
			localStorage['nicks'] || '[]'
		);
		Commands.nickname.nicknamesKey = JSON.parse(
			localStorage['nicksKey'] || '[]'
		);
	}();

	export const CommandKeys = (function(): string[] {
		const commands: string[] = [];

		for (let command in Commands) {
			if (Commands.hasOwnProperty(command)) {
				commands.push(command);
			}
		}
		return commands;
	}());
}