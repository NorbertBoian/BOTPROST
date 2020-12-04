import { playSong } from "./playSong";

export const playSongs = (urls, connection) => {
  const finish = () => {
    urls.shift();
    play();
  };
  const play = async () => {
    console.log(urls[0]);
    const dispatcher = await playSong(urls[0], connection);
    dispatcher.on("finish", finish);
  };
  play();
};
