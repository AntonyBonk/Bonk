Matter.use(MatterWrap);

const matterContainer = document.querySelector("#matter-container");
const THICCNESS = 60;

// module aliases
var Engine = Matter.Engine,
  Render = Matter.Render,
  Runner = Matter.Runner,
  Bodies = Matter.Bodies,
  Composite = Matter.Composite;

// create an engine
var engine = Engine.create();

// create a renderer
var render = Render.create({
  element: matterContainer,
  engine: engine,
  options: {
    width: matterContainer.clientWidth,
    height: matterContainer.clientHeight,
    background: "transparent",
    wireframes: false,
    showAngleIndicator: false,
  },
});

// create two boxes and a ground
// var boxA = Bodies.rectangle(400, 200, 80, 80);
// var boxB = Bodies.rectangle(450, 50, 80, 80);

let textures = [
  "images/image6.png",
  "images/image3.png",
];

for (let i = 0; i < 20; i++) {
  let textureIndex = i % textures.length;
  let box = Bodies.circle(450, 0, 60, {
    render: {
      sprite: {
        texture: textures[textureIndex],
      },
    },

    friction: 0.03,
    frictionAir: 0.000001,
    restitution: 0.5,
    plugin: {
      wrap: {
        min: {
          x: 0,
          y: 0,
        },
        max: {
          x: matterContainer.clientWidth,
          y: matterContainer.clientHeight,
        },
      },
    },
  });

  Composite.add(engine.world, box);
}

var ground = Bodies.rectangle(
  matterContainer.clientWidth / 2,
  matterContainer.clientHeight + THICCNESS / 2,
  27184,
  THICCNESS,
  { isStatic: true },
);

// let leftWall = Bodies.rectangle(
//   0 - THICCNESS / 2,
//   matterContainer.clientHeight / 2,
//   THICCNESS,
//   matterContainer.clientHeight * 5,
//   {
//     isStatic: true,
//   },
// );

// let rightWall = Bodies.rectangle(
//   matterContainer.clientWidth + THICCNESS / 2,
//   matterContainer.clientHeight / 2,
//   THICCNESS,
//   matterContainer.clientHeight * 5,
//   { isStatic: true },
// );

// add all of the bodies to the world
Composite.add(engine.world, [ground]);

let mouse = Matter.Mouse.create(render.canvas);
let mouseConstraint = Matter.MouseConstraint.create(engine, {
  mouse: mouse,
  constraint: {
    stiffness: 0.2,
    render: {
      visible: false,
    },
  },
});

Composite.add(engine.world, mouseConstraint);

// allow scroll through the canvas
mouseConstraint.mouse.element.removeEventListener(
  "mousewheel",
  mouseConstraint.mouse.mousewheel,
);
mouseConstraint.mouse.element.removeEventListener(
  "DOMMouseScroll",
  mouseConstraint.mouse.mousewheel,
);

// run the renderer
Render.run(render);

// create runner
var runner = Runner.create();

// run the engine
Runner.run(runner, engine);

function handleResize(matterContainer) {
  // set canvas size to new values
  render.canvas.width = matterContainer.clientWidth;
  render.canvas.height = matterContainer.clientHeight;

  // reposition ground
  Matter.Body.setPosition(
    ground,
    Matter.Vector.create(
      matterContainer.clientWidth / 2,
      matterContainer.clientHeight + THICCNESS / 2,
    ),
  );

  // reposition right wall
  //   Matter.Body.setPosition(
  //     rightWall,
  //     Matter.Vector.create(
  //       matterContainer.clientWidth + THICCNESS / 2,
  //       matterContainer.clientHeight / 2,
  //     ),
  //   );
}

window.addEventListener("resize", () => handleResize(matterContainer));
