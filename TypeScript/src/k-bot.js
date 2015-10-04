/**
 * KBot -- Interfaces
 * @author Kali@F-List.net
 */
/**
 * KBot -- Classes
 * @author Kali@F-List.net
 */
/// <reference path="bot.d.ts" />
var HttpRequest = (function () {
    function HttpRequest(url, options) {
        var httpRequest = new XMLHttpRequest();
        var uri = '';
        var key;
        this.atOut = new Date();
        httpRequest.onreadystatechange = (function (self) {
            return function onReadyStateChange(event) {
                self.status = this.status;
                self.state = this.readyState;
                self.response = this.response;
                self.responseText = this.responseText || '';
                self.statusText = this.statusText || '';
                if (self.state === 4) {
                    self.atIn = new Date();
                    self.response = JSON.parse(self.responseText);
                    if (self.status === 200 && !self.response.error) {
                        return self.success({
                            response: self.response,
                            request: self
                        });
                    }
                    if (self.status !== 200) {
                        return self.fail({
                            httpError: true,
                            error: self.statusText,
                            code: self.status,
                            request: self
                        });
                    }
                    return self.fail({
                        serverError: true,
                        error: self.response.error,
                        request: self
                    });
                }
                return;
            };
        })(this);
        if (options && options.data) {
            httpRequest.open('POST', url, true);
            httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            for (key in options.data) {
                if (options.data.hasOwnProperty(key)) {
                    uri += key + '=' + options.data[key] + '&';
                }
            }
            uri = uri.slice(0, uri.length - 1);
        }
        else {
            httpRequest.open('GET', url);
        }
        httpRequest.send(uri);
        this.status = httpRequest.status;
        this.statusText = httpRequest.statusText;
        this.state = httpRequest.readyState;
        this.responseText = httpRequest.responseText;
        this.response = httpRequest.response;
        this.fail = options && options.fail ?
            options.fail : function () { };
        this.success = options && options.success ?
            options.success : function () { };
    }
    return HttpRequest;
})();
/**
 * KBot -- Hook: Interfaces
 * @author Kali@F-List.net
 */
/**
 * KBot -- Hook: Module
 * @author Kali@F-List.net
 */
/// <reference path="../bot.d.ts" />
/// <reference path="interfaces.ts" />
var Local = FList.Chat;
FList.Chat.commands.MSG = function MSG(args) {
    var character = args.character;
    var message = args.message;
    var type = "chat";
    if (Local.ignoreList.indexOf(character.toLowerCase()) !== -1) {
        return;
    }
    if (args.channel.toLowerCase() === 'frontpage') {
        message = message
            .replace(/\[icon\]/g, '[user]')
            .replace(/\[\/icon\]/g, '[/user]');
    }
    if (Local.Roleplay.isRoleplay(message)) {
        message = message.substr(3);
        type = 'rp';
    }
    KBot.read({
        message: message,
        channel: Local.TabBar.getTabFromId('channel', args.channel),
        name: character,
        type: type
    });
    Local.printMessage({
        msg: message,
        to: Local.TabBar.getTabFromId('channel', args.channel),
        from: character,
        type: type
    });
    return;
};
FList.Chat.commands.PRI = function PRI(args) {
    var character = args.character;
    var characterSafe = character.toLowerCase();
    var isIgnored = Local.ignoreList.indexOf(characterSafe) !== -1;
    var message = args.message;
    var type = 'chat';
    var tabObject = Local.TabBar.getTabFromId('user', character);
    if (isIgnored) {
        FList.Connection.send('IGN' + JSON.stringify({
            action: 'notify',
            character: character
        }));
        return;
    }
    if (Local.Roleplay.isRoleplay(message)) {
        message = message.substr(3);
        type = 'rp';
    }
    if (!tabObject) {
        Local.openPrivateChat(characterSafe);
        tabObject = Local.TabBar.getTabFromId('user', character);
    }
    tabObject.tab
        .children('.tpn')
        .removeClass('tpn-paused')
        .hide();
    if (tabObject.closed) {
        tabObject.tab.show();
        tabObject.closed = false;
    }
    Local.Logs.saveLogs(character, {
        msg: message,
        kind: type,
        to: characterSafe
    });
    Local.printMessage({
        msg: message,
        to: tabObject,
        from: character,
        type: type
    });
    KBot.read({
        message: message,
        channel: tabObject,
        name: character,
        type: type
    });
};
FList.Chat.Input = {
    handle: function handle(message) {
        var curTab = Local.TabBar.activeTab;
        var cData = Local.channels.getData(curTab.id);
        var isCommand = message.charAt(0) === '/';
        var isRp = !message.indexOf('/me');
        var isWarn = !message.indexOf('/warn ');
        var type = isRp ? 'rp' : 'chat';
        if (curTab.type === 'console') {
            if (isCommand && !isRp && !isWarn) {
                return this.parse(message);
            }
            return FList.Common_displayError('You cannot chat in the console');
        }
        if (curTab.type === 'channel') {
            if (isCommand && !isRp && !isWarn) {
                return this.parse(message);
            }
            if (cData.mode === 'ads') {
                Local.Roleplay.sendAd(curTab.id, message);
            }
            if (message.trim()) {
                if (Local.Settings.current.html5Audio) {
                    Local.Sound.playSound('chat');
                }
                FList.Connection.send("MSG " + JSON.stringify({
                    channel: curTab.id,
                    message: message
                }));
                if (isRp) {
                    message = message.substr(3);
                }
                KBot.read({
                    message: message,
                    channel: curTab,
                    name: Local.identity,
                    type: type
                });
                message = KBot._sanitizeOwnMessage(message);
                Local.printMessage({
                    msg: message,
                    to: Local.TabBar.getTabFromId('channel', curTab.id),
                    from: Local.identity,
                    type: type
                });
                $('#message-field').val('');
                return;
            }
        }
        if (isCommand && !isRp && !isWarn) {
            return this.parse(message);
        }
        if (cData.mode === 'ads') {
            Local.Roleplay.sendAd(curTab.id, message);
        }
        if (message.trim()) {
            if (Local.Settings.current.html5Audio) {
                Local.Sound.playSound('chat');
            }
            FList.Connection.send("PRI " + JSON.stringify({
                recipient: curTab.id,
                message: message
            }));
            if (isRp) {
                message = message.substr(3);
            }
            KBot.read({
                message: message,
                channel: curTab,
                name: Local.identity,
                type: type
            });
            message = KBot._sanitizeOwnMessage(message);
            Local.Logs.saveLogs(Local.identity, {
                msg: message,
                kind: type,
                to: curTab.id.toLowerCase()
            });
            Local.printMessage({
                msg: message,
                to: Local.TabBar.getTabFromId('user', curTab.id),
                from: Local.identity,
                type: type
            });
            $('#message-field').val('');
            return;
        }
        curTab.metyping = false;
        curTab.mewaiting = false;
        $('#message-field').val('');
        return;
    }
};
/**
 * KBot -- Handler: Interfaces
 * @author Kali@F-List.net
 */
/**
 * KBot -- Handler: Module
 * @author Kali@F-List.net
 */
/// <reference path="../bot.d.ts" />
/// <reference path="interfaces.ts" />
void function () {
    if (KBot && KBot.tick) {
        clearInterval(KBot.tick);
        KBot.responseQueue.length = 0;
    }
    return;
}();
var KBot;
(function (KBot) {
    KBot.responseQueue = [];
    KBot.tick = setInterval(onTick, 750);
    function onTick() {
        if (KBot.responseQueue.length) {
            KBot.responseQueue.shift()();
            return;
        }
        return;
    }
    function parseArguments(data) {
        for (var i = 0, ii = data.command.arguments.length; i < ii; i++) {
            var parameter = data.parameters[i];
            if (parameter === null && !data.command.arguments[i].required) {
                continue;
            }
            if (!parameter && data.command.arguments[i].required) {
                _respond(data.channel, "Missing mandatory argument #" + (i + 1) + ".");
                return null;
            }
            if (data.command.arguments[i].type === Number) {
                parameter = parseFloat(parameter);
                if (!parameter) {
                    _respond(data.channel, "Argument [b]" + (i + 1) + "[/b] is not a valid number.");
                    return null;
                }
            }
            if (parameter.constructor !== data.command.arguments[i].type) {
                _respond(data.channel, "Argument [b]" + (i + 1) + "[/b] is not of type [b]" + _typeToString(data.command.arguments[i].type) + "[/b].");
                return null;
            }
            if (data.command.arguments[i].type === Number) {
                data.parameters[i] = parseFloat(parameter);
            }
        }
        return data.parameters;
    }
    function respondUser() {
        FList.Chat.printMessage({
            msg: _sanitizeOwnMessage(this.message),
            to: this.channel,
            from: FList.Chat.identity,
            type: 'chat',
            log: true
        });
        FList.Connection.send("PRI " + JSON.stringify({
            message: this.message,
            recipient: this.channel.id
        }));
        return;
    }
    function respondChannel() {
        FList.Chat.printMessage({
            msg: _sanitizeOwnMessage(this.message),
            to: this.channel,
            from: FList.Chat.identity,
            type: 'chat',
            log: true
        });
        FList.Connection.send("MSG " + JSON.stringify({
            message: this.message,
            channel: this.channel.id
        }));
        return;
    }
    function _typeToString(type) {
        return type
            .toSource()
            .slice(9, type
            .toSource()
            .indexOf('('))
            .toLowerCase();
    }
    KBot._typeToString = _typeToString;
    function _sanitizeOwnMessage(message) {
        return message.replace(/\</g, '&lt;')
            .replace(/\>/g, '&gt;');
    }
    KBot._sanitizeOwnMessage = _sanitizeOwnMessage;
    function _respond(tab, message, override) {
        var responseFunction;
        var overrideFunction;
        message = '[b]KBot[/b]>> ' + message;
        if (tab.type === 'user') {
            responseFunction = respondUser;
            overrideFunction = respondChannel;
        }
        else {
            responseFunction = respondChannel;
            overrideFunction = respondUser;
        }
        if (override) {
            responseFunction = overrideFunction;
            message += ' [SENT TO PRIVATE]';
        }
        KBot.responseQueue.push(responseFunction.bind({
            channel: tab,
            message: message
        }));
        return;
    }
    KBot._respond = _respond;
    function _getDisplayName(name) {
        var key = KBot.Commands.nickname.nicknamesKey.indexOf(name);
        if (key === -1) {
            return name;
        }
        return KBot.Commands.nickname.nicknames[key];
    }
    KBot._getDisplayName = _getDisplayName;
    function read(data) {
        var end = data.message.indexOf(' ') !== -1 ?
            data.message.indexOf(' ') : data.message.length;
        var command;
        var parameters;
        command = KBot.Commands[data.message.slice(1, end)];
        if (data.message.charAt(0) !== '!' || !command) {
            return;
        }
        if (data.message.indexOf(' ') === -1) {
            parameters = [null];
        }
        else {
            parameters = data.message
                .substr(data.message.indexOf(' ') + 1)
                .replace(/[ ]+/g, ' ')
                .split(' ');
        }
        if (command.arguments) {
            parameters = parseArguments({
                command: command,
                channel: data.channel,
                parameters: parameters
            });
        }
        if (!parameters) {
            return;
        }
        try {
            command.func.call({
                channel: data.channel,
                user: data.name
            }, parameters);
        }
        catch (error) {
            _respond(data.channel, "Whoops! Something bad happened: [b]" + error.message + "[/b]: [i]" + error.stack + "[/i]");
        }
    }
    KBot.read = read;
})(KBot || (KBot = {}));
/**
 * KBot -- Commands: Interfaces
 * @author Kali@F-List.net
 */
/// <reference path="../bot.d.ts" />
/**
 * KBot -- Commands: Module
 * @author Kali@F-List.net
 */
/// <reference path="../bot.d.ts" />
/// <reference path="interfaces.ts" />
var KBot;
(function (KBot) {
    var Commands;
    (function (Commands) {
        Commands.help = {
            arguments: [
                {
                    name: 'command',
                    type: String,
                    required: false
                }
            ],
            help: 'Gives you either a command listing or a command\'s' +
                ' description and syntax.',
            func: function (arguments) {
                var command = arguments[0];
                var output = '';
                var params;
                var param;
                var paramType;
                if (!command) {
                    output += "Commands: [" + KBot.CommandKeys.join(', ') + "]";
                    KBot._respond(this.channel, output);
                    return;
                }
                params = Commands[command].arguments;
                if (!Commands[command]) {
                    KBot._respond(this.channel, 'This command does not exist.');
                    return;
                }
                output += "[b]Syntax[/b]: !" + command + " ";
                if (params) {
                    for (var i = 0, ii = params.length; i < ii; i++) {
                        param = params[i];
                        paramType = KBot._typeToString(param.type);
                        output += " " + param.name + "[" + (paramType + (!param.required ? ':optional' : '')) + "]";
                    }
                }
                output += "\n[b]Description[/b]: [i]" + Commands[command].help + "[/i]";
                KBot._respond(this.channel, output);
            }
        };
        Commands.daysToMinutes = {
            arguments: [
                {
                    name: 'days',
                    type: Number,
                    required: true
                }
            ],
            help: 'Return the sum of minutes for the given number of days.',
            func: function (days) {
                KBot._respond(this.channel, days * 24 * 60 + '');
            }
        };
        Commands.googleSuggest = {
            arguments: [
                {
                    name: 'query',
                    type: String,
                    required: true
                }
            ],
            help: 'Gives you Google\'s suggested auto-completions.',
            func: function (input) {
                new HttpRequest('http://suggestqueries.google.com/complete/search', {
                    data: {
                        q: input,
                        client: 'firefox',
                        output: 'json'
                    },
                    success: (function (self) {
                        return function (data) {
                            KBot._respond(self.channel, data[1].join(', '));
                        };
                    })(this)
                });
            }
        };
        Commands.nickname = {
            nicknames: null,
            nicknamesKey: null,
            help: 'Gives you a nickname you will be known as to the bot!',
            func: function (days) {
                var nickPrefix = [
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
                var nickSuffix = [
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
                var key = Commands.nickname.nicknamesKey.indexOf(this.user);
                var randomKeyOne = ~~(Math.random() * nickPrefix.length);
                var randomKeyTwo = ~~(Math.random() * nickSuffix.length);
                var nick = nickPrefix[randomKeyOne] + nickSuffix[randomKeyTwo];
                KBot._respond(this.channel, KBot._getDisplayName(this.user) + " is now known as: [b]" + nick + "[/b].");
                if (nick.indexOf('the ') === 0) {
                    nick = nick.substr(4);
                }
                if (key !== -1) {
                    Commands.nickname.nicknamesKey.splice(key, 1);
                    Commands.nickname.nicknames.splice(key, 1);
                }
                Commands.nickname.nicknames.push(nick);
                Commands.nickname.nicknamesKey.push(this.user);
                localStorage['nicks'] = JSON.stringify(Commands.nickname.nicknames);
                localStorage['nicksKey'] = JSON.stringify(Commands.nickname.nicknamesKey);
            }
        };
        Commands.porn = {
            help: 'Gives you some random porn from e621. Enjoy.',
            func: function () {
                var max = 736510;
                var out = "[url=https://e621.net/post/show/%s]Enjoy, " + KBot._getDisplayName(this.user) + "[/url]";
                out = out.replace(/\%s/g, '' + ~~(Math.random() * max));
                KBot._respond(this.channel, out);
            }
        };
        Commands.dice = {
            help: 'Rolls some adult dice. The number of faces these things ' +
                'have is crazy.',
            func: function () {
                var dieOne = [
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
                var dieTwo = [
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
                var dieOneResult = ~~(Math.random() * dieOne.length);
                var dieTwoResult = ~~(Math.random() * dieTwo.length);
                var out = ("[b]" + KBot._getDisplayName(this.user) + "[/b] rolls ") +
                    ("[b]" + dieOneResult + "[/b]:([i]" + dieOne[dieOneResult] + "[/i]) and ") +
                    ("[b]" + dieTwoResult + "[/b]:([i]" + dieTwo[dieTwoResult] + "[/i]).");
                KBot._respond(this.channel, out);
            }
        };
        Commands.icebreak = {
            help: 'Gives you a [b][i]good[/i][/b] icebreaker!',
            func: function (days) {
                var templates = [
                    ("Hey " + KBot._getDisplayName(this.user) + ", I heard you like some [naughties] with your [innocent]."),
                    'You\'re not going to believe how many [innocent] the average [naughty] contains.',
                    'Is it hot in here, or is my [naughty] just completely covered in [naughties]?',
                    'I can see you\'re not one of those \'[innocent]\' people who are super-concerned about [naughties].',
                    ("Listen " + KBot._getDisplayName(this.user) + " -- my daughter needs [naughties] real bad."),
                    'Can you see my [naughties] through these jeans? No? How about now?',
                    'Let\'s talk about [naughties].',
                    'Your [naughties] are so fucking sexy! They look just like my mom\'s.',
                    ("You know what I like in " + KBot._getDisplayName(this.user) + "? My [naughty]."),
                    'My friends bet I couldn\'t [naughtyAction] the prettiest girl. Wanna use their money to buy [naughties]?',
                    '[naughties] are my second favourite thing to eat in bed.',
                    'I don\'t believe in [naughty] at first sight, but I\'m willing to make an exception in your case.',
                    ("Damn " + KBot._getDisplayName(this.user) + " -- your [naughtyThing] is bigger than my future!"),
                    'Of all your beautiful curves, your [naughtyThing] is my favourite.',
                    ("Damn " + KBot._getDisplayName(this.user) + " -- you're cute! Let me at your [naughties]."),
                    'I\'m no weatherman, but you can expect a few inches of [naughty] tonight.',
                    ("Well, well, well. If it isn't " + KBot._getDisplayName(this.user) + ", the person who [naughtyActioned] the last [naughty]!"),
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
                    ("You know, " + KBot._getDisplayName(this.user) + " says I'm afraid of [naughtyActioning]... want to help prove them wrong?")
                ];
                var naughtyAction = [
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
                var naughtyActioned = [
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
                var naughtyActioning = [
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
                var naughtyThing = [
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
                var naughtyThings = [
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
                var naughty = [
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
                var naughties = [
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
                var innocent = [
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
                var innocents = [
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
                var template = templates[~~(Math.random() * templates.length)];
                var output = template;
                var roll;
                function getRandom(template) {
                    var random = ~~(Math.random() * template.length);
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
                KBot._respond(this.channel, output);
            }
        };
    })(Commands = KBot.Commands || (KBot.Commands = {}));
    void function () {
        Commands.nickname.nicknames = JSON.parse(localStorage['nicks'] || '[]');
        Commands.nickname.nicknamesKey = JSON.parse(localStorage['nicksKey'] || '[]');
    }();
    KBot.CommandKeys = (function () {
        var commands = [];
        for (var command in Commands) {
            if (Commands.hasOwnProperty(command)) {
                commands.push(command);
            }
        }
        return commands;
    }());
})(KBot || (KBot = {}));
