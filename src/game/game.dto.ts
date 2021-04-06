import { ChannelName } from '../util/player-state';

export interface PlaceCardMessage {
  channel: ChannelName;
  cardId: string;
  isReal: boolean;
}

export interface UnplaceCardMessage {
  channel: ChannelName;
}
