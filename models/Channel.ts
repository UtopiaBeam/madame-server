import { ChannelData } from '../data/ChannelData';
import { RandomGenerator } from '../utils/RandomGenerator';

export class Channel {
  public id: string;

  constructor(public channelType: number) {
    this.id = RandomGenerator.uuid();
  }

  public get info() {
    const channel = ChannelData.getChannel(this.channelType);
    return { id: this.id, type: this.channelType, ...channel };
  }
}
