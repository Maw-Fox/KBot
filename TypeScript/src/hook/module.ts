/**
 * KBot -- Hook: Module
 * @author Kali@F-List.net
 */

/// <reference path="../bot.d.ts" />
/// <reference path="interfaces.ts" />
import Local = FList.Chat;

FList.Chat.commands.MSG = function MSG(args: ArgsMSG): void {
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

FList.Chat.commands.PRI = function PRI(args: ArgsPRI): void {
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
    handle: function handle(message: string): void {
        var curTab: ChannelObject = Local.TabBar.activeTab;
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

                FList.Connection.send(`MSG ${JSON.stringify({
                    channel: curTab.id,
                    message: message
                }) }`);

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

            FList.Connection.send(`PRI ${JSON.stringify({
                recipient: curTab.id,
                message: message
            }) }`);

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
            })

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