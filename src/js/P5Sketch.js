import React, { useRef, useEffect } from "react";
import * as p5 from "p5";

const P5Sketch = () => {
    const sketchRef = useRef();

    const Sketch = p => {

        p.canvas = null;

        p.canvasWidth = window.innerWidth;

        p.canvasHeight = window.innerHeight;

        p.rectangles = [];

        p.colours = [
          {
            r: 0,
            g: 0,
            b: 0,
          },
          {
            r: 255,
            g: 255,
            b: 255,
          },
          {
            r: 123,
            g: 123,
            b: 123,
          },
          {
            r: 221,
            g: 1,
            b: 0,
          },
          {
            r: 34,
            g: 80,
            b: 149,
          },
          {
            r: 250,
            g: 201,
            b: 1,
          },
        ];

        p.setup = () => {
          p.canvas = p.createCanvas(p.canvasWidth, p.canvasHeight);

          // Create some random rectangles
          const rectangleCount = p.random(8, 16);
          for (let i = 0; i < rectangleCount; i++) {
            // Randomly place some rectangles within -1..1 space
            const shrink = 0.5;
            const position = [
              p.random(-1, 1) * shrink,
              p.random(-1, 1) * shrink,
            ];
            // Create a random 0..1 scale for the rectangles
            const scale = p.random(0.25, 0.5);
            const size = [p.random(0, 1) * scale, p.random(0, 1) * scale];
            const colour = p.random(p.colours);
            p.rectangles.push({
              position,
              size,
              colour,
            });
          }
        };

        p.draw = () => {
          p.background(0);

          // Setup drawing style
          p.strokeJoin(p.MITER);
          p.rectMode(p.CENTER);
          p.noFill();
          p.stroke(255);

          // Get the minimum edge
          const minDim = Math.max(p.width, p.height);

          // Draw each rect
          p.rectangles.forEach((rectangle) => {
            const { position, size, colour } = rectangle;

            // The position and size in -1..1 normalized space
            let [x, y] = position;
            let [w, h] = size;

            p.fill(colour.r, colour.g, colour.b);
            // Map -1..1 to screen pixels
            // First we 'push' to save transformation state
            p.push();

            // Then translate to the center
            p.translate(p.width / 2, p.height / 2);

            // And scale the context by half the size of the screen
            // We use a square ratio so that the lines have even thickness
            p.scale(minDim / 2, minDim / 2);

            // The stroke weight is specified in 0..1 normalized space
            // It will be multiplied by the scale above
            p.strokeWeight(0.005);

            // now draw the rectangle
            p.rect(x, y, w, h);

            // and restore the transform for the next rectangle
            p.pop();
          });
        };

        p.mousePressed = () => {
          if (p.song.isPlaying()) {
            p.song.pause();
          } else {
            if (
              parseInt(p.song.currentTime()) >= parseInt(p.song.buffer.duration)
            ) {
              p.reset();
            }
            //document.getElementById("play-icon").classList.add("fade-out");
            p.canvas.addClass("fade-in");
            p.song.play();
          }
        };

        p.creditsLogged = false;

        p.logCredits = () => {
          if (
            !p.creditsLogged &&
            parseInt(p.song.currentTime()) >= parseInt(p.song.buffer.duration)
          ) {
            p.creditsLogged = true;
            console.log(
              "Music By: http://labcat.nz/",
              "\n",
              "Animation By: https://github.com/LABCAT/rectangles-no-2",
              "\n",
              "Code Inspiration: https://glitch.com/edit/#!/p5-example-random-rect"
            );
            p.song.stop();
          }
        };

        p.updateCanvasDimensions = () => {
            p.canvasWidth = window.innerWidth;
            p.canvasHeight = window.innerHeight;
            p.createCanvas(p.canvasWidth, p.canvasHeight);
            p.redraw();
        }

        if (window.attachEvent) {
            window.attachEvent(
                'onresize',
                function () {
                    p.updateCanvasDimensions();
                }
            );
        }
        else if (window.addEventListener) {
            window.addEventListener(
                'resize',
                function () {
                    p.updateCanvasDimensions();
                },
                true
            );
        }
        else {
            //The browser does not support Javascript event binding
        }
    };

    useEffect(() => {
        new p5(Sketch, sketchRef.current);
    }, []);

    return (
        <div ref={sketchRef}>
        </div>
    );
};

export default P5Sketch;
