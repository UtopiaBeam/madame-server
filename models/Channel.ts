import { ChannelData } from '../utils/ChannelData';
import { RandomGenerator } from '../utils/RandomGenerator';

export class Channel {
  public id: string;

  constructor(public channelType: number) {
    this.id = RandomGenerator.uuid();
  }

  public getInfo() {
    const channel = ChannelData.getChannel(this.channelType);
    return { id: this.id, ...channel };
  }
}
