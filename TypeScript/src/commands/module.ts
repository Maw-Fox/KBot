/**
 * KBot -- Commands: Module
 * @author Kali@F-List.net
 */

/// <reference path="../bot.d.ts" />
/// <reference path="interfaces.ts" />

module KBot {
	export module Commands {
		export const help: Command = {
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
				var params: CommandArgument[];

				if (!command) {
					output += `Commands: [${CommandKeys.join(', ')}]`;
					_respond(this, output);
					return;
				}

				params = Commands[command].arguments;

				if (!Commands[command]) {
					_respond(this, 'This command does not exist.');
					return;
				}

				output += `[b]Syntax[/b]: !${command} `;

				for (let i = 0, ii = params.length; i < ii; i++) {
					output += ` ${params[i].name}[${
							_typeToString(params[i].type)
						}${(!params[i].required ? ':optional' : '')}]`;
				}

				output += `\n[b]Description[/b]: [i]${
						Commands[command].help
					}[/i]`;

				_respond(this, output);
			}
		}

		export const daysToMinutes: Command = {
			arguments: [
				{
					name: 'days',
					type: Number,
					required: true
				}
			],
			help: 'Return the sum of minutes for the given number of days.',
			func: function(days: number): void {
				_respond(this, days * 24 * 60 + '');
			}
		}
	}

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