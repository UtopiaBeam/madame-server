## State

### `GameState`

```ts
{
  turn: number
  neutral: number
  playerStates: PlayerState[]
}
```

### `PlayerState`

```ts
{
  money: number
  people: number
  availableChannels: ChannelName[]
  unavailableChannels: ChannelName[]
  cards: Card[]
}
```

### `ChannelName`

```ts
'โซเชียลมีเดีย' |
  'ปากต่อปาก' |
  'เว็บเพจ' |
  'โทรทัศน์' |
  'วิทยุ' |
  'สิ่งพิมพ์' |
  'สื่อนอกบ้าน';
```

### `Card`

```ts
{
  id: string;
  name: string;
  isReal: boolean;
  audioFactor: number;
  textFactor: number;
  visualFactor: number;
  price: number;
  effectType: 'pr' | 'attack';
  from: PeopleSide;
  to: PeopleSide;
}
```

### `PeopleSide`

```ts
'neutral' | 'opponent' | 'player';
```

---

## Events

### `room:create`

Create a room

Payload:

```ts
{
  name: "test",
  avatar: "avatar-name"
}
```

Response: A string **roomId**

### `room:join`

Join an existing room

Payload:

```ts
{
  roomId: "00000",
  name: "test",
  avatar: "avatar-name"
}
```

### `game:start`

Start a game

Payload: None

Response: `GameState`

### `game:place-card`

Place a card in a channel

Payload:

```ts
{
  channel: ChannelName;
  cardId: string;
  isReal: boolean;
}
```

Response: None

### `game:unplace-card`

Remove a card from a channel

Payload:

```ts
{
  channel: ChannelName;
}
```

Response: None

### `game:submit`

Finish a user's turn

Payload: None

Response: None

**Note:** The client has to subscribe to the event `game:result` to get the duel result. The server will emit the event with the game states after each channel's duel.
