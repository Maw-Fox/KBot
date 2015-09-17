/**
 * KBot -- Commands: Module
 * @author Kali@F-List.net
 */

/// <reference path="../bot.d.ts" />
/// <reference path="interfaces.ts" />

module KBot {
	export module Commands {
		export var help: Command = {
			arguments: [
				{
					name: 'command',
					type: String,
					required: false
				}
			],
			func: function(): string {
				return '';
			}
		}
	}
}