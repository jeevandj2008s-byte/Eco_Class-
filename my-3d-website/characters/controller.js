/**
 * controller.js — Handles movement, states (idle/walk/sit) in the loop
 */
export function createCharacterController(characters = []) {
  let elapsed = 0;

  return {
    updateCharacters(delta) {
      elapsed += delta;
      characters.forEach((char, idx) => {
        // Natural idle breathing and subtle sway
        const breath = Math.sin(elapsed * 2.2 + idx * 0.7) * 0.006;
        char.position.y += breath;

        // Subtle head turn
        if (char.children[1]) {
          char.children[1].rotation.y = Math.sin(elapsed * 1.2 + idx * 0.9) * 0.12;
        }
      });
    }
  };
}

export default createCharacterController;
