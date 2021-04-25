import { ChannelName } from '../util/channels';

export interface PlaceCardMessage {
  channel: ChannelName;
  cardId: string;
  isReal: boolean;
}

export interface UnplaceCardMessage {
  channel: ChannelName;
}

export interface BuyChannelMessage {
  channel: ChannelName;
}
