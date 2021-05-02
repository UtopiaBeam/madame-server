import { ChannelData } from '../data/ChannelData';

export class Channel {
  constructor(public type: number) {}

  public get info() {
    const channel = ChannelData.getChannel(this.type);
    return { type: this.type, ...channel };
  }
}
