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
    if (KBot.tick) {
        clearInterval(KBot.tick);
        KBot.responseQueue.length = 0;
    }
    return;
}();
var KBot;
(function (KBot) {
    function sanitizeOwnMessage(message) {
        return message.replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }
    function respond(tab, message, override) {
        var responseFunction;
        var overrideFunction;
        message = '[b]KBot[/b]>> ' + message;
        function respondUser(tab, message) {
            FList.Chat.printMessage({
                msg: sanitizeOwnMessage(message),
                to: tab,
                from: FList.Chat.identity,
                type: 'chat',
                log: true
            });
            FList.Connection.send("PRI " + JSON.stringify({
                message: message,
                recipient: tab.id
            }));
            return;
        }
        function respondChannel(tab, message) {
            FList.Chat.printMessage({
                msg: sanitizeOwnMessage(message),
                to: tab,
                from: FList.Chat.identity,
                type: 'chat',
                log: true
            });
            FList.Connection.send("MSG " + JSON.stringify({
                message: message,
                channel: tab.id
            }));
            return;
        }
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
        KBot.responseQueue.push(responseFunction.bind(this, [tab, message]));
        return;
    }
    function onTick() {
        if (KBot.responseQueue.length) {
            KBot.responseQueue.shift()();
            return;
        }
        return;
    }
    KBot.responseQueue = [];
    KBot.tick = setInterval(onTick, 750);
    function read(data) {
        var command;
        var parameters;
        if (data.message.charAt(0) !== '!') {
            return;
        }
        command = KBot.Commands[data.message.slice(1, data.message.indexOf(' '))];
        if (!command) {
            return;
        }
        parameters = data.message.substr(data.message.indexOf(' ') + 1)
            .replace(/[ ]+/g, ' ')
            .split(' ');
        for (var i = 0, ii = command.arguments.length; i < ii; i++) {
            var parameter = parameters[i];
            if (!parameter && command.arguments[i].required) {
                respond(data.channel, "Missing mandatory argument #" + (i + 1) + ".");
                return;
            }
        }
        return;
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
            func: function () {
                return '';
            }
        };
    })(Commands = KBot.Commands || (KBot.Commands = {}));
})(KBot || (KBot = {}));
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
var Flist;
(function (Flist) {
    var Chat;
    (function (Chat) {
        var Commands;
        (function (Commands) {
            var Local = FList.Chat;
            function MSG(args) {
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
            }
            Commands.MSG = MSG;
            function PRI(args) {
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
                }
                else {
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
                    return;
                }
            }
            Commands.PRI = PRI;
        })(Commands = Chat.Commands || (Chat.Commands = {}));
    })(Chat = Flist.Chat || (Flist.Chat = {}));
})(Flist || (Flist = {}));
//# sourceMappingURL=k-bot.js.map