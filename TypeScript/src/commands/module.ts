/**
 * KBot -- Commands: Module
 * @author Kali@F-List.net
 */

/// <reference path="../bot.d.ts" />
/// <reference path="interfaces.ts" />

module KBot {
  export module Commands {
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

    export const googleSuggest: ICommand = {
      arguments: [
        {
          name: 'query',
          type: String,
          required: true
        }
      ],
      help: 'Gives you Google\'s suggested auto-completions.',
      func: function(input: string): void {
        new HttpRequest('http://suggestqueries.google.com/complete/search', {
          data: {
            q: input,
            client: 'firefox',
            output: 'json'
          },
          success: (function(self) {
            return function(data) {
              _respond(self.channel, data[1].join(', '))
            };
          })(this)
        });
      }
    }

    export const nickname: INicknameCommand = {
      nicknames: null,
      nicknamesKey: null,
      help: 'Gives you a nickname you will be known as to the bot!',
      func: function(days: number): void {
        const nickPrefix = [
          'the Gay',
          'Gay ',
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
          'the Bad ',
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
          'Moon ',
          'the Carcinogenic ',
          'the Moon',
          'the Dark ',
          'the Dank ',
          'Dank ',
          'the Prime ',
          'Prime ',
          'the Swag ',
          'the Lover of ',
          'the Gangly ',
          'the Dumb ',
          'the Nutty ',
          'Nutty ',
          'the Super ',
          'Super ',
          'the Red ',
          'the Black ',
          'the Pink ',
          'the White ',
          'the Brown ',
          'the Blue ',
          'Power-',
          'the Timely ',
          'the Narcissistic ',
          'the Wet ',
          'the Dirty ',
          'the Dutiful ',
          'the Fishy '
        ];
        const nickSuffix = [
          'Dick',
          'Student',
          'Nut',
          'Nuts',
          'Horns',
          'Horn',
          'Fur',
          'Butt',
          'Fish',
          'Ass',
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
          'House',
          'Dart',
          'Flash',
          'Incredible',
          'Lonesome',
          'Doctor',
          'Witch',
          'Cock-holster',
          'Cancer',
          'Tumor',
          'Growth',
          'Waste',
          'Mourner',
          'Misfit',
          'Mangle',
          'Peeper',
          'Loner',
          'Drifter',
          'Dancer',
          'Nurse',
          'Professor',
          'Trooper',
          'Tube',
          'Rocket',
          'Sock',
          'Balls',
          'Butter',
          'Butler',
          'Broker',
          'Stalker',
          'Humper',
          'Mange',
          'Fist',
          'Controller',
          'Noise',
          'Fart',
          'Meme',
          'Touch',
          'Mistake',
          'Condom',
          'Foreskin',
          'Cunt'
        ];
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
        const dieOne = [
          'Any',
          'Fuck',
          'Tongue',
          'Lick',
          'Fondle',
          'Tweek',
          'Pinch',
          'Finger',
          'Slap',
          'Bite',
          'Nibble',
          'Caress',
          'Stroke',
          'Squeeze',
          'Tug'
        ];
        const dieTwo = [
          'Any',
          'Dick',
          'Balls',
          'Tits',
          'Nipples',
          'Hair',
          'Neck',
          'Mouth/Muzzle',
          'Taint/Labia',
          'Tailbase',
          'Butt',
          'Vagoo',
          'Thighs'
        ];
        const dieOneResult = ~~(Math.random() * dieOne.length);
        const dieTwoResult = ~~(Math.random() * dieTwo.length);
        var out = `[b]${_getDisplayName(this.user) }[/b] rolls ` +
          `[b]${dieOneResult}[/b]:([i]${dieOne[dieOneResult]}[/i]) and ` +
          `[b]${dieTwoResult}[/b]:([i]${dieTwo[dieTwoResult]}[/i]).`;

        _respond(this.channel, out);
      }
    }

    export const icebreak: ICommand = {
      help: 'Gives you a [b][i]good[/i][/b] icebreaker!',
      func: function(days: number): void {
        const templates = [
          `Hey ${_getDisplayName(this.user)}, I heard you like some [naughties] with your [innocent].`,
          'You\'re not going to believe how many [innocent] the average [naughty] contains.',
          'Is it hot in here, or is my [naughty] just completely covered in [naughties]?',
          'I can see you\'re not one of those \'[innocent]\' people who are super-concerned about [naughties].',
          `Listen ${_getDisplayName(this.user)} -- my daughter needs [naughties] real bad.`,
          'Can you see my [naughties] through these jeans? No? How about now?',
          'Let\'s talk about [naughties].',
          'Your [naughties] are so fucking sexy! They look just like my mom\'s.',
          `You know what I like in ${_getDisplayName(this.user)}? My [naughty].`,
          'My friends bet I couldn\'t [naughtyAction] the prettiest girl. Wanna use their money to buy [naughties]?',
          '[naughties] are my second favourite thing to eat in bed.',
          'I don\'t believe in [naughty] at first sight, but I\'m willing to make an exception in your case.',
          `Damn ${_getDisplayName(this.user)} -- your [naughtyThing] is bigger than my future!`,
          'Of all your beautiful curves, your [naughtyThing] is my favourite.',
          `Damn ${_getDisplayName(this.user)} -- you\'re cute! Let me at your [naughties].`,
          'I\'m no weatherman, but you can expect a few inches of [naughty] tonight.',
          `Well, well, well. If it isn\'t ${_getDisplayName(this.user)}, the person who [naughtyActioned] the last [naughty]!`,
          'Sit back, relax, and allow me to explain the importance of [naughties].',
          'The more you scream, the more it\'s going to [naughtyAction] you.',
          'I don\'t really see why we need paint brushes when we have [naughties].',
          'What\'s your dream [naughty]?',
          'My doctor says I\'m lacking [naughties].',
          'I\'m no organ donor but I\'d be happy to give you my [naughty].',
          'I\'m not staring at your boobs. I\'m staring at your [naughty].',
          'There are people who say Disneyland is the happiest place on Earth. Apparently none of them have ever been in your [naughty].',
          'I wanna live in your [naughties] so I can be with you every step of the way.',
          'Do you know what my [naughty] is made of? Boyfriend material.',
          'Are you a camera? Because every time I look at you, I want to whip out my [naughty].',
          'I\'m not a photographer, but I can picture your [naughties] and my [naughty] together.',
          'So, I\'m like, \'I\'ll show you who\'s afraid of [naughtyActioning] all the [naughties]\'!',
          '[naughtyAction] me if I\'m wrong, but [naughties] still exist, right?',
          'Excuse me, but does this smell like [naughty] to you?',
          'I didn\'t know that [naughties] could fly so low!',
          `You know, ${_getDisplayName(this.user)} says I\'m afraid of [naughtyActioning]... want to help prove them wrong?`
        ];
        const naughtyAction = [
          'kiss',
          'fuck',
          'suck',
          'fellate',
          'blow',
          'rape',
          'bone',
          'wank',
          'jerk',
          'molest',
          'eat'
        ];
        const naughtyActioned = [
          'kissed',
          'fucked',
          'sucked',
          'fellated',
          'raped',
          'boned',
          'wanked',
          'jerked',
          'molested',
          'ate'
        ];
        const naughtyActioning = [
          'kissing',
          'fucking',
          'sucking',
          'fellating',
          'blowing',
          'raping',
          'boning',
          'wanking',
          'jerking',
          'molesting',
          'eating'
        ];
        const naughtyThing = [
          'dick',
          'cock',
          'pussy',
          'ass',
          'pocket rocket',
          'red rocket',
          'tit',
          'nipple',
          'asshole',
          'butt',
          'anus',
          'vagoo',
          'taco',
          'penis',
          'prick'
        ];
        const naughtyThings = [
          'dicks',
          'cocks',
          'pussies',
          'asses',
          'pocket rockets',
          'red rockets',
          'tits',
          'nipples',
          'assholes',
          'butts',
          'anuses',
          'vagoos',
          'tacos',
          'penises',
          'pricks'
        ];
        const naughty = [
          'dick',
          'cock',
          'pussy',
          'ass',
          'cum',
          'semen',
          'pocket rocket',
          'red rocket',
          'tit',
          'nipple',
          'asshole',
          'butt',
          'anus',
          'piss',
          'pee',
          'urine',
          'baby-batter',
          'spunk',
          'spooge',
          'taco',
          'penis',
          'prick',
          'porn'
        ];
        const naughties = [
          'balls',
          'testicles',
          'gonads',
          'dicks',
          'cocks',
          'pussies',
          'asses',
          'ropes of cum',
          'pints of semen',
          'pocket rockets',
          'red rockets',
          'tits',
          'nipples',
          'assholes',
          'butts',
          'anuses',
          'cups of piss',
          'gallons of pee',
          'liters of urine',
          'pints of baby-batter',
          'gallons of spunk',
          'liters of spooge',
          'tacos',
          'penises',
          'pricks'
        ];
        const innocent = [
          'egg',
          'toast',
          'cereal',
          'bacon',
          'breakfast',
          'dinner',
          'lunch',
          'supper',
          'brunch',
          'dog',
          'cat',
          'fox',
          'deer',
          'doctor',
          'hotdog',
          'mustard',
          'ketchup',
          'mayo',
          'butter',
          'pasta',
          'sauce',
          'wine',
          'beer',
          'vodka',
          'water',
          'company',
          'pet',
          'mouse',
          'rodent',
          'trap',
          'work',
          'employment',
          'boss',
          'break',
          'chocolate',
          'fondue'
        ];
        const innocents = [
          'eggs',
          'toast',
          'cereals',
          'bacon',
          'breakfasts',
          'dinners',
          'lunches',
          'suppers',
          'brunches',
          'dogs',
          'cats',
          'foxs',
          'deers',
          'doctors',
          'hotdogs',
          'mustards',
          'ketchups',
          'mayos',
          'butters',
          'pastas',
          'sauces',
          'wines',
          'beers',
          'vodkas',
          'companies',
          'pets',
          'mice',
          'rodents',
          'traps',
          'bosses',
          'breaks',
          'chocolates',
          'fondues'
        ];
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