/**
 * TS Definitions file for FChat.
 * @author Kali@F-List.net
 */

/// <reference path="jquery.d.ts" />

interface FHTMLElement extends JQuery {
    tab: ChannelObject;
}

interface ChannelObject {
    id: string;
    title: string;
    type: string;
    tab: FHTMLElement;
    closed: boolean;
    mewaiting: boolean;
    metyping: boolean;
}

interface Roleplay {
    isRoleplay(input: string): boolean;
    sendAd(channel: string, message: string): void;
}

interface TabBar {
    getTabFromId(type: string, id: string): ChannelObject;
    activeTab: any;
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
    identity: string;

    // Methods
    printMessage(args: {
        msg: string;
        to: ChannelObject;
        from: string;
        type: string;
        log?: boolean;
    }): void;

    openPrivateChat(character: string, unescape?: boolean): void;

    // Modules
    channels: any;
    Roleplay: Roleplay;
    TabBar: TabBar;
    Logs: Logs;
    Settings: any;
    Sound: any;
    Input: any;
    commands: any;
}

declare module FList {
    var Chat: Chat;
    var Connection: Connection;
    var Common_displayError: any;
}
