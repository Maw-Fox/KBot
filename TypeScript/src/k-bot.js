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
        Commands.nickname = {
            nicknames: null,
            nicknamesKey: null,
            help: 'Gives you a nickname you will be known as to the bot!',
            func: function (days) {
                var nickPrefix = [
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
                var nickSuffix = [
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
