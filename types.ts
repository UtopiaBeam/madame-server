import * as express from 'express';
import { GameSetting } from './models/GameSetting';

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

export interface UpdateGameSettingBody {
  setting: Partial<GameSetting>;
}

export interface CreateRoomBody {
  name: string;
  avatar: string;
  setting?: Partial<GameSetting>;
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

export interface SelectCardsBody {
  cardTypes: number[];
}

export interface PlaySpecialActionBody {
  actionType: number;
  playerId: string;
  cardId?: string;
}
