/**
 * KBot -- Handler: Interfaces
 * @author Kali@F-List.net
 */

interface IHookArgs {
  message: string;
  channel: ChannelObject;
  name: string;
  type: string;
}

interface IParseArgumentsOptions {
  channel: ChannelObject;
  command: ICommand;
  parameters: any[];
}