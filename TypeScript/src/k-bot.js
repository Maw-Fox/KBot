/**
 * KBot -- Commands: Module
 * @author Kali@F-List.net
 */
/// <reference path="../bot.d.ts" /> 
/**
 * KBot -- Handler: Module
 * @author Kali@F-List.net
 */
/// <reference path="../bot.d.ts" />
/// <reference path="interfaces.ts" /> 
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
                    msg: message,
                    to: Local.TabBar.getTabFromId('channel', args.channel),
                    from: character,
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
                        msg: message,
                        to: tabObject,
                        from: character,
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