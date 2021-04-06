import { Injectable } from '@nestjs/common';
import { Card } from '../util/card';
import { Channel, channels } from '../util/channels';
import { GameState } from '../util/game-state';
import { Player } from '../util/player';

@Injectable()
export class GameService {
  private states: Record<string, GameState> = {};

  getGameState(roomId: string): GameState {
    return this.states[roomId];
  }

  createGameState(roomId: string, player: Player) {
    this.states[roomId] = new GameState();
    this.states[roomId].addPlayer(player);
  }

  deleteGameState(roomId: string) {
    delete this.states[roomId];
  }

  joinRoom(roomId: string, player: Player) {
    const gameState = this.getGameState(roomId);
    gameState.addPlayer(player);
  }

  markPlayerReady(roomId: string, playerId: string): boolean {
    const gameState = this.getGameState(roomId);
    return gameState.markPlayerReady(playerId);
  }

  battle(roomId: string): GameState {
    const gameState = this.getGameState(roomId);
    const cards = gameState.getChannelCards();
    const [p1, p2] = Object.keys(cards);

    for (let i = 0; i < cards[p1].length; i++) {
      const p1Card = cards[p1][i];
      const p2Card = cards[p2][i];
      const channel = channels[i];

      const p1People = this.calculateAffectedPeople(
        gameState,
        p1,
        p1Card,
        channel,
      );
      const p2People = this.calculateAffectedPeople(
        gameState,
        p2,
        p2Card,
        channel,
      );

      this.updatePeople(gameState, p1, p1Card, p1People);
      this.updatePeople(gameState, p2, p2Card, p2People);
    }

    return gameState;
  }

  private calculateTotalFactor(channel: Channel, card: Card): number {
    return (
      channel.audio * card.audioFactor +
      channel.text * card.textFactor +
      channel.visual * card.visualFactor
    );
  }

  private calculateAffectedPeople(
    gameState: GameState,
    playerId: string,
    card: Card,
    channel: Channel,
  ): number {
    const factor = this.calculateTotalFactor(channel, card);
    switch (card.from) {
      case 'neutral':
        return Math.floor(gameState.neutral * factor);
      case 'opponent':
        return Math.floor(gameState.findOpponent(playerId).people * factor);
      case 'player':
        return Math.floor(gameState.findPlayer(playerId).people * factor);
    }
  }

  private updatePeople(
    gameState: GameState,
    playerId: string,
    card: Card,
    people: number,
  ) {
    const player = gameState.findPlayer(playerId);
    const opponent = gameState.findOpponent(playerId);

    if (card.from === 'neutral') {
      gameState.neutral -= people;
    } else if (card.from === 'opponent') {
      opponent.people -= people;
    } else {
      player.people -= people;
    }

    if (card.to === 'neutral') {
      gameState.neutral += people;
    } else if (card.to === 'opponent') {
      opponent.people += people;
    } else {
      player.people += people;
    }
  }

  prepareNextTurn(gameState: GameState) {
    gameState.prepareNextTurn();
  }

  start(roomId: string) {
    const gameState = this.getGameState(roomId);
    if (gameState.playerStates.length < 2) {
      throw new Error('Room is not full');
    }

    gameState.start();

    return gameState;
  }
}
