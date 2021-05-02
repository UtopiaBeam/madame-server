import * as express from 'express';

export interface Request<Query extends {} = {}, Body = {}>
  extends express.Request {
  query: Query;
  body: Body & { gameId: string; playerId: string };
}

export interface StateQuery {
  gameId: string;
  playerId: string;
}

export interface GameSettingQuery {
  gameId: string;
}

export interface CreateRoomBody {
  name: string;
  avatar: string;
}

export interface JoinRoomBody {
  name: string;
  avatar: string;
}

export interface BuyChannelBody {
  channelTypes: number[];
}

export interface PlaceCardBody {
  channelType: number;
  cardId: string;
  isReal: boolean;
}

export interface UnplaceCardBody {
  channelType: number;
}

export interface SelectCardsBody {
  cardTypes: number[];
}
