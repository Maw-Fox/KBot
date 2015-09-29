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
        var param: CommandArgument;
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
        _respond(this.channel, days * 24 * 60 + '');
      }
    }

    export const nickname: NicknameCommand = {
      nicknames: null,
      nicknamesKey: null,
      help: 'Gives you a nickname you will be known as to the bot!',
      func: function(days: number): void {
        const nickPrefix = [
          'the ',
          'the Major ',
          'Major ',
          'Sir ',
          'the Lazy-',
          'the Silly ',
          'the Lovely ',
          'the Lovable ',
          'the Hardcore ',
          'the Artistic ',
          'the Virtuous ',
          'the Scarlet ',
          'the Mammoth ',
          'the Foxish ',
          'the Flamboyant ',
          'the Broken ',
          'the Pristine ',
          'the Brutal ',
          'the Childish ',
          'the Wanton ',
          'the Restless ',
          'the Ornry ',
          'the Lonely ',
          'the Ugly ',
          'the Pretty ',
          'the Foul ',
          'the Hard ',
          'the Flaccid ',
          'the Good ',
          'the Bad',
          'the Tiny ',
          'the Tight ',
          'the Booty ',
          'the Sexy ',
          'the Surfing ',
          'the Rancid ',
          'the Great ',
          'the Gross ',
          'the Grotesque ',
          'the Gored ',
          'the Noodly ',
          'the Naked ',
          'the Nasty ',
          'the Noob ',
          'the Bulbous ',
          'the Batter ',
          'the Womanly ',
          'Miss ',
          'Officer ',
          'Doctor ',
          'Patient ',
          'President ',
          'Prime Minister ',
          'King ',
          'Queen ',
          'the Bloated ',
          'the Hard ',
          'the Rough ',
          'the Tough ',
          'the Brutish ',
          'the Boner ',
          'Prince ',
          'Princess ',
          'Moon '
        ];
        const nickSuffix = [
          'Dick',
          'Nut',
          'Horns',
          'Fur',
          'Butt',
          'Fish',
          'Ass',
          'Philip',
          'Fornicator',
          'Moon',
          'Sun',
          'Terminator',
          'Moose',
          'Fluffy one',
          'Island',
          'Unstoppable Force',
          'Monkey',
          'Monster',
          'Lover',
          'Fucker',
          'Fox',
          'Faffer',
          'Fapper',
          'One',
          'Pain',
          'Dickbutt',
          'Dickhead',
          'Doll',
          'Dildo',
          'Donger',
          'Dong',
          'Goof',
          'Doofus',
          'Robot',
          'Romper',
          'Stomper',
          'Agitator',
          'Aggressor',
          'Apostle',
          'Disciple',
          'Adept',
          'Warlock',
          'Wizard',
          'Sorceror',
          'Saucer',
          'Cook',
          'Stiff',
          'Joe',
          'Jane',
          'Jug',
          'Mug',
          'Crook',
          'Monster',
          'Meat',
          'Motherfucker',
          'Wanker',
          'Rulebreaker',
          'Convict',
          'Gangster',
          'Pothead',
          'Poker',
          'Prince',
          'Princess',
          'Banger',
          'Bus',
          'Blasphemer',
          'Heretic',
          'Hose',
          'Truck',
          'Beast',
          'Boner',
          'Bastard',
          'Bimbo',
          'Bank',
          'Child',
          'Guy',
          'Girl',
          'Man',
          'Woman',
          'Killer',
          'Murderer',
          'Knob-polisher',
          'Punisher',
          'Breaker',
          'Badass',
          'Meeper',
          'Pie',
          'Cutie',
          'Cutter',
          'Drifter',
          'Hoser',
          'Poser',
          'Semen-extractor',
          'House'
        ];
        const key = nickname.nicknamesKey.indexOf(this.user);
        const randomKeyOne = ~~(Math.random() * nickPrefix.length);
        const randomKeyTwo = ~~(Math.random() * nickSuffix.length);
        var nick = nickPrefix[randomKeyOne] + nickSuffix[randomKeyTwo];

        _respond(this.channel,
          `${_getDisplayName(this.user)} is now known as: [b]${nick}[/b].`
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

    export const porn: Command = {
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