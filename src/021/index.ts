import { readLines } from "../helpers/readLines";
import { Day } from "../runner";

function* rollDie(): Generator<number> {
  let index = 0;

  while (true) {
    index += 1;
    if (index > 100) {
      index %= 100;
    }
    yield index;
  }
}

const solve1 = ([
  player1StartingPosition,
  player2StartingPosition,
]: number[]): number => {
  let player1Position = player1StartingPosition;
  let player2Position = player2StartingPosition;

  let player1Score = 0;
  let player2Score = 0;

  let isPlayer1sMove = true;
  let numberOfRolls = 0;

  const dieRoller = rollDie();

  while (player1Score < 1000 && player2Score < 1000) {
    const rolls =
      dieRoller.next().value + dieRoller.next().value + dieRoller.next().value;
    numberOfRolls += 3;

    // console.log(
    //   player1Position,
    //   player2Position,
    //   player1Score,
    //   player2Score,
    //   rolls
    // );

    if (isPlayer1sMove) {
      player1Position += rolls;
      player1Position %= 10;
      if (player1Position === 0) {
        player1Position = 10;
      }

      player1Score += player1Position;
    } else {
      player2Position += rolls;
      player2Position %= 10;
      if (player2Position === 0) {
        player2Position = 10;
      }

      player2Score += player2Position;
    }

    isPlayer1sMove = !isPlayer1sMove;
  }

  return numberOfRolls * Math.min(player1Score, player2Score);
};

type Player = {
  position: number;
  score: number;
};

const cache: Map<string, { player1Wins: number; player2Wins: number }> =
  new Map();

const gameToCacheKey = (
  player1: Player,
  player2: Player,
  isPlayer1ToMove: boolean
): string =>
  `${player1.score},${player1.position},${player2.score},${player2.position},${isPlayer1ToMove}`;

const playDiracGame = (
  player1: Player,
  player2: Player,
  isPlayer1ToMove: boolean
): { player1Wins: number; player2Wins: number } => {
  if (player1.score >= 21) {
    return {
      player1Wins: 1,
      player2Wins: 0,
    };
  }
  if (player2.score >= 21) {
    return {
      player1Wins: 0,
      player2Wins: 1,
    };
  }

  if (cache.has(gameToCacheKey(player1, player2, isPlayer1ToMove))) {
    return cache.get(gameToCacheKey(player1, player2, isPlayer1ToMove));
  }

  let nextResults: { player1Wins: number; player2Wins: number }[];
  const rolls = [
    3, 4, 4, 4, 5, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 6, 7, 7, 7, 7, 7, 7, 8, 8,
    8, 9,
  ];

  const getNewPosition = (position: number, roll: number): number => {
    const sum = position + roll;
    return sum > 10 ? sum % 10 : sum;
  };

  if (isPlayer1ToMove) {
    nextResults = rolls
      .map((roll) => getNewPosition(player1.position, roll))
      .map((position) => ({ score: player1.score + position, position }))
      .map((player) => playDiracGame(player, player2, !isPlayer1ToMove));
  } else {
    nextResults = rolls
      .map((roll) => getNewPosition(player2.position, roll))
      .map((position) => ({ score: player2.score + position, position }))
      .map((player) => playDiracGame(player1, player, !isPlayer1ToMove));
  }

  const result = {
    player1Wins: nextResults.reduce(
      (sub, { player1Wins }) => sub + player1Wins,
      0
    ),
    player2Wins: nextResults.reduce(
      (sub, { player2Wins }) => sub + player2Wins,
      0
    ),
  };

  cache.set(gameToCacheKey(player1, player2, isPlayer1ToMove), result);

  return result;
};

const solve2 = ([
  player1StartingPosition,
  player2StartingPosition,
]: number[]): number => {
  const results = playDiracGame(
    {
      score: 0,
      position: player1StartingPosition,
    },
    {
      score: 0,
      position: player2StartingPosition,
    },
    true
  );

  return Math.max(results.player1Wins, results.player2Wins);
};

const parse = (lines: string[]): number[] => lines.map((s) => parseInt(s, 10));

const getSimpleInput = () => readLines(`${__dirname}/simple.txt`);
const getPuzzleInput = () => readLines(`${__dirname}/puzzle.txt`);

const day1: Day<
  ReturnType<typeof getPuzzleInput>,
  ReturnType<typeof parse>,
  ReturnType<typeof solve1>
> = {
  getSimpleInput,
  getPuzzleInput,
  parse,
  part1: {
    answers: {
      simple: 1,
      puzzle: 7,
    },
    solve: solve1,
  },
  part2: {
    answers: {
      simple: 5,
      puzzle: 1065,
    },
    solve: solve2,
  },
};

export default day1;
