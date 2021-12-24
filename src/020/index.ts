import { readLines } from "../helpers/readLines";
import { Day } from "../runner";

type Point = {
  x: number;
  y: number;
};

const getNextValue = (
  algorithm: boolean[],
  image: Set<string>,
  x: number,
  y: number,
  trueValue: string,
  falseValue: string
): boolean => {
  const topLeft = image.has(`${x - 1},${y - 1}`) ? trueValue : falseValue;
  const topMiddle = image.has(`${x},${y - 1}`) ? trueValue : falseValue;
  const topRight = image.has(`${x + 1},${y - 1}`) ? trueValue : falseValue;
  const middleLeft = image.has(`${x - 1},${y}`) ? trueValue : falseValue;
  const center = image.has(`${x},${y}`) ? trueValue : falseValue;
  const middleRight = image.has(`${x + 1},${y}`) ? trueValue : falseValue;
  const bottomLeft = image.has(`${x - 1},${y + 1}`) ? trueValue : falseValue;
  const bottomMiddle = image.has(`${x},${y + 1}`) ? trueValue : falseValue;
  const bottomRight = image.has(`${x + 1},${y + 1}`) ? trueValue : falseValue;

  const binaryNumber = `${topLeft}${topMiddle}${topRight}${middleLeft}${center}${middleRight}${bottomLeft}${bottomMiddle}${bottomRight}`;

  const value = parseInt(binaryNumber, 2);
  return algorithm[value];
};

const enhanceTwice = (
  algorithm: boolean[],
  image: Set<string>
): Set<string> => {
  const invertedImage = new Set<string>();

  const points: Point[] = [...image.values()].map((point) => {
    const [x, y] = point.split(",").map((s) => parseInt(s, 10));
    return { x, y };
  });

  const minX = Math.min(...points.map(({ x }) => x));
  const maxX = Math.max(...points.map(({ x }) => x));
  const minY = Math.min(...points.map(({ y }) => y));
  const maxY = Math.max(...points.map(({ y }) => y));

  for (let y = minY - 10; y < maxY + 10; y += 1) {
    for (let x = minX - 10; x < maxX + 10; x += 1) {
      const isOn = getNextValue(algorithm, image, x, y, "1", "0");

      if (!isOn) {
        invertedImage.add(`${x},${y}`);
      }
    }
  }

  const enhancedImage = new Set<string>();

  console.log(invertedImage);

  const offPoints: Point[] = [...invertedImage.values()].map((point) => {
    const [x, y] = point.split(",").map((s) => parseInt(s, 10));
    return { x, y };
  });

  const minOffPointsX = Math.min(...offPoints.map(({ x }) => x));
  const maxOffPointsX = Math.max(...offPoints.map(({ x }) => x));
  const minOffPointsY = Math.min(...offPoints.map(({ y }) => y));
  const maxOffPointsY = Math.max(...offPoints.map(({ y }) => y));

  for (let y = minOffPointsX - 5; y < maxOffPointsX + 5; y += 1) {
    for (let x = minOffPointsY - 5; x < maxOffPointsY + 5; x += 1) {
      const isOn = getNextValue(algorithm, invertedImage, x, y, "0", "1");

      if (isOn) {
        enhancedImage.add(`${x},${y}`);
      }
    }
  }

  return enhancedImage;
};

// const enhance = (algorithm: boolean[], image: Set<string>): Set<string> => {
//   const enhancedImage = new Set<string>();
//
//   const points: Point[] = [...image.values()].map((point) => {
//     const [x, y] = point.split(",").map((s) => parseInt(s, 10));
//     return { x, y };
//   });
//
//   const minX = Math.min(...points.map(({ x }) => x));
//   const maxX = Math.max(...points.map(({ x }) => x));
//   const minY = Math.min(...points.map(({ y }) => y));
//   const maxY = Math.max(...points.map(({ y }) => y));
//
//   for (let y = minY - 10; y < maxY + 10; y += 1) {
//     for (let x = minX - 10; x < maxX + 10; x += 1) {
//       const topLeft = image.has(`${x - 1},${y - 1}`) ? "1" : "0";
//       const topMiddle = image.has(`${x},${y - 1}`) ? "1" : "0";
//       const topRight = image.has(`${x + 1},${y - 1}`) ? "1" : "0";
//       const middleLeft = image.has(`${x - 1},${y}`) ? "1" : "0";
//       const center = image.has(`${x},${y}`) ? "1" : "0";
//       const middleRight = image.has(`${x + 1},${y}`) ? "1" : "0";
//       const bottomLeft = image.has(`${x - 1},${y + 1}`) ? "1" : "0";
//       const bottomMiddle = image.has(`${x},${y + 1}`) ? "1" : "0";
//       const bottomRight = image.has(`${x + 1},${y + 1}`) ? "1" : "0";
//
//       const binaryNumber = `${topLeft}${topMiddle}${topRight}${middleLeft}${center}${middleRight}${bottomLeft}${bottomMiddle}${bottomRight}`;
//
//       const value = parseInt(binaryNumber, 2);
//       if (algorithm[value]) {
//         enhancedImage.add(`${x},${y}`);
//       }
//     }
//   }
//
//   return enhancedImage;
// };

const solve1 = ([algorithm, image]: [boolean[], Set<string>]): number => {
  let enhancedImage = image;
  for (let i = 0; i < 50; i += 2) {
    enhancedImage = enhanceTwice(algorithm, enhancedImage);
    console.log(enhancedImage);
  }

  return enhancedImage.size;
};

const solve2 = ([algorithm, image]: [boolean[], Set<string>]): number => 1;

const parse = (lines: string[]): [boolean[], Set<string>] => {
  const [inputAlgorithm, , ...inputImage] = lines;

  const algorithm = inputAlgorithm.split("").map((char) => char === "#");
  const image: Set<string> = new Set();

  inputImage.forEach((line, i) => {
    line.split("").forEach((char, j) => {
      if (char === "#") {
        image.add(`${j},${i}`);
      }
    });
  });

  return [algorithm, image];
};

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
