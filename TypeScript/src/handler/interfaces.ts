/**
 * KBot -- Handler: Interfaces
 * @author Kali@F-List.net
 */

interface HookArgs {
  message: string;
  channel: ChannelObject;
  name: string;
  type: string;
}

interface ParseArgumentsOptions {
  channel: ChannelObject;
  command: Command;
  parameters: any[];
}