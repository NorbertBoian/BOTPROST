import ytsr from "ytsr";
export const getSongURLandDuration = async (artistsNames, songName) => {
  const searchResult = await ytsr(`${artistsNames} ${songName}`, {
    limit: 10,
  });
  const foundSongs = searchResult.items;
  const firstLiveVideoFilter = (item) => {
    const itemIsVideo = item.type === "video";
    const channelIsESC = itemIsVideo
      ? item.author.channelID === "UCRpjHHu8ivVWs73uxHlWwFA"
      : false;
    const YtTitleLiveMatch = item.title.match(/live/gi);
    const SongTitleLiveMatch = `${artistsNames} ${songName}`.match(/live/gi);
    const timesLiveInYtTitle = YtTitleLiveMatch ? YtTitleLiveMatch.length : 0;
    const timesLiveInSongTitle = SongTitleLiveMatch
      ? SongTitleLiveMatch.length
      : 0;
    const YtTitleContainsLive = timesLiveInYtTitle > timesLiveInSongTitle;
    if (itemIsVideo && channelIsESC && YtTitleContainsLive) {
      return true;
    } else return false;
  };
  const indexOfFirstLiveVideo = foundSongs.findIndex(firstLiveVideoFilter);
  const indexOfChosenVideo =
    indexOfFirstLiveVideo > -1 ? indexOfFirstLiveVideo : 0;
  const songURL = foundSongs[indexOfChosenVideo].url;
  const songDuration = foundSongs[indexOfChosenVideo].duration;
  return { songURL, songDuration };
};
