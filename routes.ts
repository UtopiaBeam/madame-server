import * as express from 'express';
import { io } from '.';
import { Game } from './models/Game';
import { Player } from './models/Player';
import { GameStore } from './stores/GameStore';
import { PlayerStore } from './stores/PlayerStore';
import {
  BuyChannelBody,
  CreateRoomBody,
  JoinRoomBody,
  PlaceCardBody,
  Request,
  SelectCardsBody,
  StateQuery,
  UnplaceCardBody,
} from './types';

const router = express.Router();

router.get('/state', (req: Request<StateQuery>, res: express.Response) => {
  const game = GameStore.findOne(req.query.gameId);
  res.send(game.getStateForPlayer(req.query.playerId));
});

router.post(
  '/create-room',
  (req: Request<{}, CreateRoomBody>, res: express.Response) => {
    const player = new Player(req.body.name, req.body.avatar);
    const game = new Game(player.id);

    PlayerStore.add(player);
    GameStore.add(game);

    res.send({ gameId: game.id, playerId: player.id });
  },
);

router.post(
  '/join-room',
  (req: Request<{}, JoinRoomBody>, res: express.Response) => {
    const player = new Player(req.body.name, req.body.avatar);
    const game = GameStore.findOne(req.body.gameId);

    PlayerStore.add(player);
    game.addPlayer(player);

    res.send({ playerId: player.id });
  },
);

router.post('/start-game', (req: Request<{}, {}>, res: express.Response) => {
  const game = GameStore.findOne(req.body.gameId);
  if (game.players.length === 2) {
    game.start();
    res.sendStatus(201);
    game.emit('start-game');
  } else {
    res.status(400).send({ error: 'Room is not full' });
  }
});

router.post(
  '/buy-channel',
  (req: Request<{}, BuyChannelBody>, res: express.Response) => {
    try {
      const game = GameStore.findOne(req.body.gameId);
      const player = game.findPlayer(req.body.playerId);
      player.buyChannel(req.body.channelId);
      res.send(game.getStateForPlayer(req.body.playerId));
    } catch (error) {
      res.status(400).send({ error });
    }
  },
);

router.post(
  '/place-card',
  (req: Request<{}, PlaceCardBody>, res: express.Response) => {
    try {
      const game = GameStore.findOne(req.body.gameId);
      const player = game.findPlayer(req.body.playerId);
      player.placeCardToChannel(
        req.body.channelType,
        req.body.cardId,
        req.body.isReal,
      );
      res.send(game.getStateForPlayer(req.body.playerId));
    } catch (error) {
      res.status(400).send({ error });
    }
  },
);

router.post(
  '/unplace-card',
  (req: Request<{}, UnplaceCardBody>, res: express.Response) => {
    try {
      const game = GameStore.findOne(req.body.gameId);
      const player = game.findPlayer(req.body.playerId);
      player.unplaceCardFromChannel(req.body.channelType);
    } catch (error) {
      res.status(400).send({ error });
    }
  },
);

router.post('/ready-battle', (req: Request, res: express.Response) => {
  const game = GameStore.findOne(req.body.gameId);
  const player = game.findPlayer(req.body.playerId);
  player.isReady = true;
  res.send(game.getStateForPlayer(player.id));
  if (game.everyPlayersReady()) {
    const result = game.battle();
    game.emit('battle-result', { result, state: game.state });
  }
});

router.post('/ready-special-action', (req: Request, res: express.Response) => {
  const game = GameStore.findOne(req.body.gameId);
  const player = game.findPlayer(req.body.playerId);
  player.isReady = true;
  res.send(game.getStateForPlayer(player.id));
  if (game.everyPlayersReady()) {
    game.startSpecialAction();
    game.emit('start-special-action');
  }
});

router.post('/ready-end-round', (req: Request, res: express.Response) => {
  const game = GameStore.findOne(req.body.gameId);
  const player = game.findPlayer(req.body.playerId);
  player.isReady = true;
  res.send(game.getStateForPlayer(player.id));
  if (game.everyPlayersReady()) {
    // TODO
  }
});

router.post('/deal-cards', (req: Request, res: express.Response) => {
  const game = GameStore.findOne(req.body.gameId);
  res.send(game.dealCards());
});

router.post(
  '/select-cards',
  (req: Request<{}, SelectCardsBody>, res: express.Response) => {
    try {
      const game = GameStore.findOne(req.body.gameId);
      game.selectCards(req.body.playerId, req.body.cardTypes);
      res.send(game.getStateForPlayer(req.body.playerId));
    } catch (error) {
      res.status(400).send({ error });
    }
  },
);

export default router;
