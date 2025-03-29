import chalk from "chalk";

function logger(title, message) {
  const colors = [
    {
      color: "blue",
      background: "bgBlue",
    },
    {
      color: "blueBright",
      background: "bgBlueBright",
    },
    {
      color: "cyan",
      background: "bgCyan",
    },
    {
      color: "cyanBright",
      background: "bgCyanBright",
    },
    {
      color: "green",
      background: "bgBright",
    },
    {
      color: "magenta",
      background: "bgMagenta",
    },
    {
      color: "magentaBright",
      background: "bgMagentaBright",
    },
    {
      color: "red",
      background: "bgRed",
    },
    {
      color: "redBright",
      background: "bgRedBright",
    },
    {
      color: "yellow",
      background: "bgYellow",
    },
    {
      color: "yelloBright",
      background: "bgYellowBright",
    },
  ];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  return console.log(
    `${chalk[randomColor.background](`\x20${title}\x20`)}: ${message}`
  );
}

export default logger;
