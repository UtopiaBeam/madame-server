import * as express from 'express';

export interface Request<Query extends {}, Body = {}> extends express.Request {
  query: Query;
  body: Body & { gameId: string; playerId: string };
}

export interface StateQuery {
  gameId: string;
  playerId: string;
}

export interface CreateRoomBody {
  name: string;
  avatar: string;
}

export interface JoinRoomBody {
  name: string;
  avatar: string;
}

export interface StartGameBody {
  gameId: string;
}

export interface BuyChannelBody {
  channelId: string;
}

export interface PlaceCardBody {
  channelType: number;
  cardId: string;
  isReal: boolean;
}

export interface UnplaceCardBody {
  channelType: number;
}
