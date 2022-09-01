import styled from "styled-components";
import { useState } from "react";
import "./index.css";

const createNewMap = function () {
  let randNumbers = [];
  let numbers = [...Array(16).keys()];
  let map4x4 = Array.from(Array(4), () => new Array(4).fill(0));

  while (numbers.length) {
    var index = Math.floor(Math.random() * numbers.length);
    randNumbers.push(numbers[index]);
    numbers.splice(index, 1); // Remove the item from the array
  }

  map4x4.forEach((row, index_row) => {
    map4x4[index_row].forEach((el, index_el) => {
      let number = randNumbers.shift();
      map4x4[index_row][index_el] = number;
    });
  });

  return map4x4;
};

let map4x4 = createNewMap();

const colors = [
  "teal",
  "red",
  "#63E91980",
  "#0000FF80",
  "cyan",
  "magenta",
  "yellow",
  "orange",
  "BurlyWood",
  "Chocolate ",
  "Crimson ",
  "DarkGray ",
  "DarkMagenta",
  "DarkOrchid",
  "DarkSeaGreen"
];

function App() {
  // const preSolutionMap = [
  //   [1, 2, 3, 4],
  //   [5, 6, 7, 8],
  //   [9, 10, 11, 12],
  //   [13, 14, 0, 15]
  // ];

  // const initialMap = preSolutionMap;

  const initialMap = map4x4;

  const solutionMap = [
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12],
    [13, 14, 15, 0]
  ];

  const [map, setMap] = useState(initialMap);

  // console.log("Map = ", map);

  const newMap = [...map];
  // console.log("newMap = ", newMap);

  // console.log(map[0]);

  let winCondition = JSON.stringify(solutionMap) === JSON.stringify(map);
  console.log("win condition = ", winCondition);

  const winString = winCondition ? "YOU WIN" : " YOU WIN ";

  return (
    <div key={"appdiv"} className="App">
      <ConWrapper
        show={winCondition}
        onClick={() => {
          let newStartMap = createNewMap();
          setMap(newStartMap);
        }}
      >
        {winString}
      </ConWrapper>

      <div key={"container_DIV"} className="container">
        {newMap.map((row, row_index) => {
          return row.map((el, el_index) => {
            if (el !== 0) {
              return (
                <Square
                  key={el_index + row_index * 10}
                  number={el}
                  color={colors.at(el - 1)}
                  position={[row_index, el_index]}
                  map={map}
                  updateMap={(pos) => {
                    // console.log("updated pos", pos);

                    // console.log("previous Map", newMap);

                    let [x0, y0] = pos[0];
                    let [x1, y1] = pos[1];

                    let curMovingNumber = newMap[x0][y0];
                    newMap[x1][y1] = curMovingNumber;
                    newMap[x0][y0] = 0;

                    // console.log("new Map", newMap);

                    setMap([...newMap]);
                  }}
                />
              );
            } else {
              return <div key={el_index * 13 + row_index * 10}></div>;
            }
          });
        })}
      </div>
    </div>
  );
}

function Square(props) {
  const initialPos = [[0, 0], props.position];

  const [pos, setPos] = useState(initialPos);

  const SQUARE_STYLES = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    height: "47px",
    width: "47px",
    borderRadius: "7px",
    backgroundColor: `${props.color}`,
    top: `${pos[1][0] * 50 + 25}px`,
    left: `${pos[1][1] * 50 + 25}px`,
    transition: "top 0.5s, left 0.5s"
  };

  function getMoveDirection([i, j]) {
    const map = props.map;
    // console.log("i = ", i);

    let left;
    try {
      left = map[i][j - 1] === 0 ? true : false;
    } catch (err) {
      left = false;
    }

    let right;
    try {
      right = map[i][j + 1] === 0 ? true : false;
    } catch (err) {
      right = false;
    }

    let up;
    try {
      up = map[i - 1][j] === 0 ? true : false;
    } catch (err) {
      up = false;
    }

    let down;
    try {
      down = map[i + 1][j] === 0 ? true : false;
    } catch (err) {
      down = false;
    }

    const allowed = up
      ? "up"
      : down
      ? "down"
      : left
      ? "left"
      : right
      ? "right"
      : "none";

    return allowed;
  }

  function move() {
    // console.log("started moving");

    let prevPos = pos[1];
    // console.log("startind position", prevPos);

    let [y, x] = prevPos;
    // console.log("startind coords", [x, y]);

    const moveDir = getMoveDirection(prevPos);
    // const moveDir = "right";
    // console.log("can move to", moveDir);

    moveDir !== "none"
      ? moveDir === "right"
        ? (x += 1)
        : moveDir === "left"
        ? (x -= 1)
        : moveDir === "up"
        ? (y -= 1)
        : moveDir === "down"
        ? (y += 1)
        : (x += 0)
      : (x += 0);

    let curPos = [y, x];
    let newPos = [prevPos, curPos];

    setPos([...newPos]);

    moveDir !== "none" &&
      setTimeout(() => {
        props.updateMap(newPos);
      }, 500);
  }

  // const SquareWrapper = styled.div`
  //   display: flex;
  //   flex-direction: column;
  //   justify-content: center;
  //   align-items: center;
  //   position: absolute;
  //   height: 47px;
  //   width: 47px;
  //   border-radius: 7px;
  //   background-color: ${props.color};
  //   top: ${pos[1][0] * 50 + 25}px;
  //   left: ${pos[1][1] * 50 + 25}px;
  //   transition: top 0.5s, left 0.5s;
  // `;

  return (
    // <SquareWrapper>
    //   <div onClick={move}>{props.number}</div>
    // </SquareWrapper>

    <div onClick={move} style={SQUARE_STYLES}>
      <div>{props.number}</div>
    </div>
  );
}

const ConWrapper = styled.div`
  background-color: aqua;
  font-size: 24pt;
  font-weight: bold;
  border: 1px solid black;
  margin: 20px;
  padding: 20px;
  border-radius: 10px;
  visibility: ${(props) => (props.show ? "visible" : "hidden")};
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-60%, -76%);
  z-index: 50;
`;

export const AppWrapper = styled.div`
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  height: 100vh;
  position: relative;
  background-color: darkslategrey;
  font-family: sans-serif;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
`;

export default App;
