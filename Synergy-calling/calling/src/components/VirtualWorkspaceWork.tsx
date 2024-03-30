import { useRef, useEffect } from "react";
import mapImage from "../assets/map300.png";
import playeraImage from "../assets/adamfull.png";
import playerbimage from "../assets/bobfull.png";
import playercimage from "../assets/amelfull.png";
import playerdimage from "../assets/rfull.png";
import { get, set } from "firebase/database";
// import { collisions } from "./collisions.js";

interface WorkspaceProps {
  exCanvasRef: any;
  sendPlayer: any;
  getBoard: any;
  socket: any;
}
const VirtualWorkspaceWork = ({
  exCanvasRef,
  sendPlayer,
  getBoard,
  socket,
}: WorkspaceProps) => {
  const charArr = [playeraImage, playerbimage, playercimage, playerdimage];
  const canvasRef = useRef(null);
  let section = 3; // 1- W, 2 - A, 3 - S, 0-D
  let frame = 1; //1-6

  useEffect(() => {
    console.log("canvasRef", canvasRef);
  }, [canvasRef]);

  useEffect(() => {
    const collisions = [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      295, 295, 295, 295, 295, 295, 295, 295, 295, 295, 295, 295, 295, 295, 295,
      295, 295, 295, 295, 295, 295, 295, 295, 0, 0, 295, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 295, 0, 0, 295, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 295, 295, 295, 295, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 295, 295, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 295,
      295, 0, 0, 0, 0, 295, 295, 295, 295, 295, 295, 295, 295, 295, 295, 295,
      295, 295, 295, 295, 0, 0, 0, 0, 295, 295, 0, 0, 0, 0, 295, 295, 295, 295,
      295, 295, 295, 295, 295, 295, 295, 295, 295, 295, 295, 0, 0, 0, 0, 295,
      295, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      295, 295, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 295, 295, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 295, 295, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 295, 295, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 295, 295, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 295, 295, 295, 295, 295, 295, 295, 295, 295,
      295, 295, 295, 295, 295, 295, 295, 295, 295, 295, 295, 295, 295, 295, 295,
      295, 295,
    ];

    const collisionsMap = [];
    for (let i = 0; i < collisions.length; i += 25) {
      collisionsMap.push(collisions.slice(i, 25 + i));
    }
    class Boundary {
      constructor({ position }) {
        this.position = position;
        this.width = 48;
        this.height = 48;
      }
      draw() {
        c.fillStyle = "transparent";
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
      }
    }

    const boundaries = [];
    collisionsMap.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (cell === 295) {
          boundaries.push(
            new Boundary({
              position: { x: j * 48 - 150 + 22, y: i * 48 + 50 },
            })
          );
        }
      });
    });
    const canvas = canvasRef.current;
    const c = canvas.getContext("2d");

    canvas.width = 1024;
    canvas.height = 576;

    c.fillStyle = "white";
    c.fillRect(0, 0, canvas.width, canvas.height);
    const image = new Image();
    image.src = mapImage;

    const paimage = new Image();
    // paimage.src = charArr[Math.floor(Math.random() * charArr.length)];
    paimage.src = playeraImage;

    class Sprite {
      constructor({ position, image }) {
        this.position = position;
        this.image = image;
        this.frameIndex = 19; // Add a frame index to keep track of the current frame
        this.width = this.image.width / 24; // Assuming the sprite sheet has 6 frames
        this.height = this.image.height;
      }
      draw(name) {
        const frameWidth = this.image.width / 24; // Calculate the width of each frame
        c.drawImage(
          this.image,
          this.frameIndex * frameWidth, // Use the frame index to select the correct frame
          0,
          frameWidth,
          this.image.height,
          this.position.x - frameWidth / 2, // Center the image horizontally
          this.position.y - this.image.height / 2, // Center the image vertically
          frameWidth,
          this.image.height
        );
        c.fillStyle = "black"; // Choose a color for the text
        c.font = "20px Arial"; // Choose a font and size for the text
        let textWidth = c.measureText(name).width;
        c.fillText(
          name,
          this.position.x - textWidth / 2,
          this.position.y - this.image.height / 2 + 15
        );
      }
      nextFrame(x, y) {
        this.frameIndex = x + 6 * y; // y's max value is 3, y is 0 indexed. x can be 1-6
      }
    }
    const background = new Sprite({
      position: { x: -150, y: 0 },
      image: image,
    });

    const player = new Sprite({
      position: { x: 35, y: canvas.height / 2 },
      image: paimage,
    });

    const player2 = new Sprite({
      position: { x: 35, y: canvas.height / 2 },
      image: paimage,
    });

    const keys = {
      w: {
        pressed: false,
      },
      a: {
        pressed: false,
      },
      s: {
        pressed: false,
      },
      d: {
        pressed: false,
      },
    };

    let frameChangeDelay = 5; // Change this value to make the animation faster or slower
    let setPlayerDelay = 10;
    let counter = 0;

    function isColliding(player, boundary) {
      return (
        player.position.x < boundary.position.x + boundary.width &&
        player.position.x + player.width > boundary.position.x &&
        player.position.y < boundary.position.y + boundary.height &&
        player.position.y + player.height > boundary.position.y
      );
    }

    function animate() {
      window.requestAnimationFrame(animate);
      c.drawImage(image, -150, 0);
      boundaries.forEach((boundary) => {
        boundary.draw();
      });
      player.draw("Ziyaan");
      // getBoard();
      // socket?.on("virtual-workspace", (canvasData) => {
      //   console.log("canvas data received", canvasData.position);
      //   player2.position = canvasData.position;
      // });
      // console.log("p2", player2.position);

      socket?.on("virtual-workspace", (canvasData) => {
        // console.log("canvas data received", canvasData.position);
        player2.position = canvasData.position;
        player2.nextFrame(canvasData.frame, canvasData.section);
      });
      player2.draw("Rachael");
      counter++;
      if (counter >= frameChangeDelay) {
        counter = 0;
        let nextPosition = { ...player.position };
        if (keys.w.pressed) {
          if (section === 1) {
            frame = (frame + 1) % 6;
          } else {
            frame = 0;
          }
          section = 1;
          nextPosition.y -= 6;
          player.nextFrame(frame, section);
          setPlayerDelay -= 5;
          if (setPlayerDelay === 0) {
            setPlayerDelay = 10;
            sendPlayer({
              position: player.position,
              frame: frame,
              section: section,
            });
          }
          // sendPlayer({
          //   position: player.position,
          //   frame: frame,
          //   section: section,
          // });
        }
        if (keys.a.pressed) {
          if (section === 2) {
            frame = (frame + 1) % 6;
          } else {
            frame = 0;
          }
          section = 2;
          nextPosition.x -= 6;
          player.nextFrame(frame, section);
          setPlayerDelay -= 5;
          if (setPlayerDelay === 0) {
            setPlayerDelay = 10;
            sendPlayer({
              position: player.position,
              frame: frame,
              section: section,
            });
          }
        }
        if (keys.s.pressed) {
          if (section === 3) {
            frame = (frame + 1) % 6;
          } else {
            frame = 0;
          }
          section = 3;
          nextPosition.y += 6;
          player.nextFrame(frame, section);
          setPlayerDelay -= 5;
          if (setPlayerDelay === 0) {
            setPlayerDelay = 10;
            sendPlayer({
              position: player.position,
              frame: frame,
              section: section,
            });
          }
        }
        if (keys.d.pressed) {
          if (section === 0) {
            frame = (frame + 1) % 6;
          } else {
            frame = 0;
          }
          section = 0;
          nextPosition.x += 6;
          player.nextFrame(frame, section);
          setPlayerDelay -= 5;
          if (setPlayerDelay === 0) {
            setPlayerDelay = 10;
            sendPlayer({
              position: player.position,
              frame: frame,
              section: section,
            });
          }
        }
        let newPosition = getBoard(nextPosition);
        let nextPlayer = new Sprite({ ...player, position: nextPosition });
        // if (newPosition) {
        //   nextPlayer = new Sprite({ ...player, position: newPosition });
        // }
        let willCollide = boundaries.some((boundary) =>
          isColliding(nextPlayer, boundary)
        );

        if (!willCollide) {
          player.position = nextPosition;
        }
      }
    }

    animate();

    window.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "w":
          keys.w.pressed = true;
          break;
        case "a":
          keys.a.pressed = true;
          break;
        case "s":
          keys.s.pressed = true;
          break;
        case "d":
          keys.d.pressed = true;
          break;
      }
    });
    window.addEventListener("keyup", (e) => {
      switch (e.key) {
        case "w":
          keys.w.pressed = false;
          break;
        case "a":
          keys.a.pressed = false;
          break;
        case "s":
          keys.s.pressed = false;
          break;
        case "d":
          keys.d.pressed = false;
          break;
      }
    });
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        width: "100%",
      }}
    >
      <canvas height="1000" width="1500" ref={canvasRef}></canvas>
    </div>
  );
};

export default VirtualWorkspaceWork;
