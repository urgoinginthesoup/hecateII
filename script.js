
const rifle = document.getElementById("rifle");
const scene = document.getElementById("scene");
const angleSlider = document.getElementById("angle");
const status = document.getElementById("status");

let angle = 0;
let flipped = false;
let firing = false;

function update() {
  rifle.style.transform =
    `rotate(${angle}deg) scaleX(${flipped ? -1 : 1})`;

  angleSlider.value = angle;
  rifle.classList.toggle("flipped", flipped);
}

document.getElementById("up").onclick = () => {
  angle = Math.max(-60, angle - 10);
  update();
};

document.getElementById("down").onclick = () => {
  angle = Math.min(60, angle + 10);
  update();
};

angleSlider.oninput = () => {
  angle = Number(angleSlider.value);
  update();
};

document.getElementById("turn").onclick = () => {
  flipped = !flipped;
  update();
};

document.getElementById("reset").onclick = () => {
  angle = 0;
  flipped = false;
  update();
  status.textContent = "HECATE II — READY";
};

function fire() {
  const shot = document.createElement("div");
  shot.className = "projectile";
  scene.appendChild(shot);

  const sceneRect = scene.getBoundingClientRect();
  const rifleRect = rifle.getBoundingClientRect();

  // Position of the muzzle relative to the rifle's centre.
  // The muzzle is on the right of the original image.
  const localX = (flipped ? -1 : 1) * rifle.offsetWidth * 0.425;
  const localY = -rifle.offsetHeight * 0.07;

  const radians = angle * Math.PI / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);

  const rotatedX = localX * cos - localY * sin;
  const rotatedY = localX * sin + localY * cos;

  const centreX = rifleRect.left + rifleRect.width / 2;
  const centreY = rifleRect.top + rifleRect.height / 2;

  const startX = centreX + rotatedX - sceneRect.left;
  const startY = centreY + rotatedY - sceneRect.top;

  const direction = flipped ? -1 : 1;
  const dx = direction * cos;
  const dy = direction * sin;

  shot.style.left = `${startX}px`;
  shot.style.top = `${startY}px`;

  const distance = Math.hypot(
    window.innerWidth,
    window.innerHeight
  ) * 2;

  shot.animate(
    [
      { transform: "translate(0px, 0px)" },
      {
        transform:
          `translate(${dx * distance}px, ${dy * distance}px)`
      }
    ],
    {
      duration: 700,
      easing: "linear",
      fill: "forwards"
    }
  );

  rifle.classList.remove("recoil");
  void rifle.offsetWidth;
  rifle.classList.add("recoil");

  status.textContent = "✦ FIRED! ✦";

  shot.addEventListener("animationend", () => shot.remove());

  setTimeout(() => {
    shot.remove();
    status.textContent = "HECATE II — READY";
  }, 750);
}

document.getElementById("fire").onclick = fire;
rifle.addEventListener("click", fire);

document.addEventListener("keydown", event => {
  if (event.repeat) return;

  switch (event.key.toLowerCase()) {
    case "w":
    case "arrowup":
      document.getElementById("up").click();
      break;

    case "s":
    case "arrowdown":
      document.getElementById("down").click();
      break;

    case "f":
      document.getElementById("turn").click();
      break;

    case " ":
      event.preventDefault();
      fire();
      break;
  }
});

update();
