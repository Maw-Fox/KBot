/**
 * TS Definitions file for FChat.
 * @author Kali@F-List.net
 */

/// <reference path="jquery.d.ts" />

interface FHTMLElement extends JQuery {
    tab: ChannelObject;
}

interface ChannelObject {
    tab: JQuery;
    closed: boolean;
}

interface Roleplay {
    isRoleplay(input: string): boolean;
}

interface TabBar {
    getTabFromId(type: string, id: string): ChannelObject;
}

interface Connection {
    send(json: string): void;
}

interface Logs {
    saveLogs(character: string, data: {
        msg: string;
        kind: string;
        to: string;
    }): void;
}

interface Chat {
    // Properties
    ignoreList: string[];

    // Methods
    printMessage(args: {
        message: string;
        to: ChannelObject;
        from: string;
        type: string;
        log?: boolean;
    }): void;

    openPrivateChat(character: string, unescape?: boolean): void;

    // Modules
    Roleplay: Roleplay;
    TabBar: TabBar;
    Logs: Logs;
}

declare module FList {
    var Chat: Chat;
    var Connection: Connection;
}
