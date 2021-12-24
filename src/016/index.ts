import { readLines } from "../helpers/readLines";
import { Day } from "../runner";

// const solveLiteralValuePacket = (packet: string): number => ;

type ResolvedPacket = {
  packet: string;
  version: number;
  typeId: number;
  remainingPacket: string;
  value: number;
};

const resolveLiteralValuePacket = (packet: string): ResolvedPacket => {
  const version = parseInt(packet.slice(0, 3), 2);
  const typeId = parseInt(packet.slice(3, 6), 2);

  let binaryNumber: string = "";

  let remainingPacket = packet.slice(6);
  while (remainingPacket.charAt(0) === "1") {
    binaryNumber += remainingPacket.slice(1, 5);
    remainingPacket = remainingPacket.slice(5);
  }

  binaryNumber += remainingPacket.slice(1, 5);

  remainingPacket = remainingPacket.slice(5);

  return {
    packet: packet.slice(0, packet.length - remainingPacket.length),
    value: parseInt(binaryNumber, 2),
    version,
    typeId,
    remainingPacket,
  };
};

const resolveOperatorPacket = (packet: string): ResolvedPacket => {
  const version = parseInt(packet.slice(0, 3), 2);
  const typeId = parseInt(packet.slice(3, 6), 2);

  const lengthTypeId = packet.charAt(6);
  let totalVersion = version;

  if (lengthTypeId === "0") {
    const totalLengthOfSubPackets = parseInt(packet.slice(7, 22), 2);

    let remainingPacket = packet.slice(22);
    let n = 0;
    const values = [];
    while (n < totalLengthOfSubPackets) {
      // eslint-disable-next-line no-use-before-define
      const resolvedPacket = resolvePacket(remainingPacket);
      totalVersion += resolvedPacket.version;
      values.push(resolvedPacket.value);
      // console.log(resolvedPacket);
      n += resolvedPacket.packet.length;
      remainingPacket = resolvedPacket.remainingPacket;
    }

    let value: number;

    if (typeId === 0) {
      value = values.reduce((sub, v) => sub + v);
    } else if (typeId === 1) {
      value = values.reduce((sub, v) => sub * v);
    } else if (typeId === 2) {
      value = Math.min(...values);
    } else if (typeId === 3) {
      value = Math.max(...values);
    } else if (typeId === 5) {
      value = values[0] > values[1] ? 1 : 0;
    } else if (typeId === 6) {
      value = values[0] < values[1] ? 1 : 0;
    } else {
      value = values[0] === values[1] ? 1 : 0;
    }

    return {
      packet: packet.slice(0, packet.length - remainingPacket.length),
      version: totalVersion,
      typeId,
      remainingPacket,
      value,
    };
  }

  const numberOfSubPackets = parseInt(packet.slice(7, 18), 2);

  let remainingPacket = packet.slice(18);
  const values = [];
  for (let i = 0; i < numberOfSubPackets; i += 1) {
    // eslint-disable-next-line no-use-before-define
    const resolvedPacket = resolvePacket(remainingPacket);
    values.push(resolvedPacket.value);
    // console.log(resolvedPacket);
    remainingPacket = resolvedPacket.remainingPacket;
    totalVersion += resolvedPacket.version;
  }

  let value: number;

  if (typeId === 0) {
    value = values.reduce((sub, v) => sub + v);
  } else if (typeId === 1) {
    value = values.reduce((sub, v) => sub * v);
  } else if (typeId === 2) {
    value = Math.min(...values);
  } else if (typeId === 3) {
    value = Math.max(...values);
  } else if (typeId === 5) {
    value = values[0] > values[1] ? 1 : 0;
  } else if (typeId === 6) {
    value = values[0] < values[1] ? 1 : 0;
  } else {
    value = values[0] === values[1] ? 1 : 0;
  }

  return {
    packet: packet.slice(0, packet.length - remainingPacket.length),
    version: totalVersion,
    typeId,
    remainingPacket,
    value,
  };
};

const resolvePacket = (packet: string): ResolvedPacket => {
  const typeId = parseInt(packet.slice(3, 6), 2);

  if (typeId === 4) {
    return resolveLiteralValuePacket(packet);
  }

  return resolveOperatorPacket(packet);
};

const solve1 = (packet: string): number => {
  const resolvedPacket = resolvePacket(packet);

  return resolvedPacket.version;
};

const solve2 = (packet: string): number => {
  const resolvedPacket = resolvePacket(packet);

  return resolvedPacket.value;
};

const withLeadingZeroes = (binary: string, length: number): string =>
  binary.length === length ? binary : withLeadingZeroes(`0${binary}`, 4);

const parse = ([line]: string[]): string =>
  line
    .split("")
    .map((hex) => parseInt(hex, 16).toString(2))
    .map((binary) => withLeadingZeroes(binary, 4))
    .join("");

const getSimpleInput = () => readLines(`${__dirname}/simple.txt`);
const getPuzzleInput = () => readLines(`${__dirname}/puzzle.txt`);

const day16: Day<
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
      puzzle: 947,
    },
    solve: solve1,
  },
  part2: {
    answers: {
      simple: 5,
      puzzle: 660797830937,
    },
    solve: solve2,
  },
};

export default day16;
