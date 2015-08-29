/**
 * KBot -- Hook: Module
 * @author Kali@F-List.net
 */

/// <reference path="../bot.d.ts" />
/// <reference path="interfaces.ts" />

module FList {
    module Chat {
        module commands {
            import Chat = FList.Chat;

            export function MSG(args: ArgsMSG): void {
                var character = args.character;
                var message = args.message;
                var type = "chat";

                if (Chat.ignoreList.indexOf(character.toLowerCase()) !== -1) {
                    return;
                }

                if (args.channel.toLowerCase() === 'frontpage') {
                    message = message
                        .replace(/\[icon\]/g, '[user]')
                        .replace(/\[\/icon\]/g, '[/user]');
                }

                if (Chat.Roleplay.isRoleplay(message)) {
                    message = message.substr(3);
                    type = 'rp';
                }

                KBot.read({
                    msg: message,
                    to: Chat.TabBar.getTabFromId('channel', args.channel),
                    from: character,
                    type: type
                });

                Chat.printMessage({
                    message: message,
                    to: Chat.TabBar.getTabFromId('channel', args.channel),
                    from: character,
                    type: type
                });
                return;
            }

            export function PRI(args: ArgsPRI): void {
                var character = args.character;
                var characterSafe = character.toLowerCase();
                var isIgnored = Chat.ignoreList.indexOf(characterSafe) !== -1;
                var message = args.message;
                var type = 'chat';
                var tabObject = Chat.TabBar.getTabFromId('user', character);

                if (isIgnored) {
                    Connection.send('IGN' + JSON.stringify({
                        action: 'notify',
                        character: character
                    }));
                    return;
                }

                if (Chat.Roleplay.isRoleplay(message)) {
                    message = message.substr(3);
                    type = 'rp';
                }

                if (!tabObject) {
                    Chat.openPrivateChat(characterSafe);
                } else {
                    tabObject.tab
                        .children('.tpn')
                        .removeClass('tpn-paused')
                        .hide();

                    if (tabObject.closed) {
                        tabObject.tab.show();
                        tabObject.closed = false;
                    }

                    Chat.Logs.saveLogs(character, {
                        msg: message,
                        kind: type,
                        to: characterSafe
                    });

                    Chat.printMessage({
                        message: message,
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
        }
    }
}
