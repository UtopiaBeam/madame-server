import * as express from 'express';
import { io } from '.';
import { CardData } from './data/CardData';
import { ChannelData } from './data/ChannelData';
import { SpecialActionData } from './data/SpecialActionData';
import { Game } from './models/Game';
import { GameSetting } from './models/GameSetting';
import { Player } from './models/Player';
import { GameStore } from './stores/GameStore';
import { PlayerStore } from './stores/PlayerStore';
import {
  BuyChannelBody,
  CreateRoomBody,
  GameSettingQuery,
  JoinRoomBody,
  PlaceCardBody,
  PlaySpecialActionBody,
  Request,
  SelectCardsBody,
  StateQuery,
  UnplaceCardBody,
  UpdateGameSettingBody,
} from './types';

const router = express.Router();

router.get('/channels', (req: express.Request, res: express.Response) => {
  res.send({ channelData: ChannelData.channels });
});

router.get('/cards', (req: express.Request, res: express.Response) => {
  res.send({ cardData: CardData.cards });
});

router.get(
  '/special-actions',
  (req: express.Request, res: express.Response) => {
    res.send({ specialActionData: SpecialActionData.specialActions });
  },
);

router.get('/state', (req: Request<StateQuery>, res: express.Response) => {
  const game = GameStore.findOne(req.query.gameId);
  res.send(game.getStateForPlayer(req.query.playerId));
});

router.get(
  '/setting',
  (req: Request<GameSettingQuery>, res: express.Response) => {
    const game = GameStore.findOne(req.query.gameId);
    res.send(game.setting);
  },
);

router.post(
  '/setting',
  (req: Request<{}, UpdateGameSettingBody>, res: express.Response) => {
    const game = GameStore.findOne(req.body.gameId);
    res.send(game.setting);
  },
);

router.post(
  '/create-room',
  (req: Request<{}, CreateRoomBody>, res: express.Response) => {
    const player = new Player(req.body.name, req.body.avatar);
    const game = new Game(new GameSetting(req.body.setting));

    PlayerStore.add(player);
    GameStore.add(game);
    game.addPlayer(player);

    res.send({ gameId: game.id, playerId: player.id, setting: game.setting });
  },
);

router.post(
  '/join-room',
  (req: Request<{}, JoinRoomBody>, res: express.Response) => {
    const player = new Player(req.body.name, req.body.avatar);
    const game = GameStore.findOne(req.body.gameId);

    PlayerStore.add(player);
    game.addPlayer(player);

    res.send({ playerId: player.id, setting: game.setting });
  },
);

router.post('/start-game', (req: Request, res: express.Response) => {
  const game = GameStore.findOne(req.body.gameId);
  if (game.players.length === 2) {
    game.start();
    res.sendStatus(201);
    game.emit('start-round');
  } else {
    res.status(400).send({ error: 'Room is not full' });
  }
});

router.post(
  '/buy-channels',
  (req: Request<{}, BuyChannelBody>, res: express.Response) => {
    try {
      const game = GameStore.findOne(req.body.gameId);
      const player = game.findPlayer(req.body.playerId);
      player.buyChannels(req.body.channelTypes);
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
      if (game.event && !game.event.cardEffect.allowFake && !req.body.isReal) {
        throw new Error('Fake card is not allowed this round');
      }
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
    game.emit('battle-result', { result });
  }
});

router.post(
  '/play-special-action',
  (req: Request<{}, PlaySpecialActionBody>, res: express.Response) => {
    const game = GameStore.findOne(req.body.gameId);
    game.handleSpecialAction(req.body);
  },
);

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
    const result = game.getSpecialActionResult();
    game.emit('special-action-result', result);
    game.resetPlayersReady();
  }
});

router.post('/ready-next-round', (req: Request, res: express.Response) => {
  const game = GameStore.findOne(req.body.gameId);
  const player = game.findPlayer(req.body.playerId);
  player.isReady = true;
  res.send(game.getStateForPlayer(player.id));
  if (game.everyPlayersReady()) {
    game.nextRound();
    game.emit('end-round');
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
      const player = game.findPlayer(req.body.playerId);
      player.isReady = true;
      res.send(game.getStateForPlayer(req.body.playerId));
      if (game.everyPlayersReady()) {
        game.startRound();
        game.emit('start-round');
        game.resetPlayersReady();
      }
    } catch (error) {
      res.status(400).send({ error });
    }
  },
);

export default router;
