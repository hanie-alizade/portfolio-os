import Image from "next/image";

const GAMES = [
  {
    id: "find-bug",
    name: "Find the Bug",
    description: "Can you find all the hidden bugs?",
    icon: "🐛",
  },
  {
    id: "performance",
    name: "Performance Challenge",
    description: "Optimize the slow component.",
    icon: "⚡",
  },
  {
    id: "css-battle",
    name: "CSS Battle",
    description: "Make it look identical.",
    icon: "🎨",
  },
  {
    id: "memory",
    name: "Memory Game",
    description: "Test your component memory.",
    icon: "🧠",
  },
] as const;

export function LetsPlayWindowContent() {
  return (
    <div className="os-play">
      <div className="os-play__layout">
        <div className="os-play__main">
          <h3 className="os-eyebrow">Playground</h3>
          <p className="os-window-copy">Choose Your Adventure</p>
          <ul className="os-play__games">
            {GAMES.map((game) => (
              <li key={game.id}>
                <button type="button" className="os-play__game">
                  <span className="os-play__game-icon" aria-hidden="true">
                    {game.icon}
                  </span>
                  <span className="os-play__game-copy">
                    <strong>{game.name}</strong>
                    <span>{game.description}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <button type="button" className="os-btn os-btn--primary">
            START GAME
          </button>
        </div>
        <div className="os-window-content__media os-window-content__media--plain os-play__arcade">
          <Image
            src="/os/lets-play.png"
            alt="Neon arcade cabinet illustration"
            width={1536}
            height={1024}
            className="os-window-media-image"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}
