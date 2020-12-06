import { defaultThumbnail } from "../quizExports";
import { getJoinedRankingStrings } from "./getJoinedRankingStrings";

export const getRevealEmbedObject = (
  shuffledSongsInfo,
  songIndex,
  competingUsers
) => {
  const currentSong = shuffledSongsInfo[songIndex];
  const currentArtist = currentSong.artistName;
  const currentSongName = currentSong.name;
  const currentSongTitle = `${currentArtist} - ${currentSongName}`;
  const currentSongThumbnail = currentSong.thumbnail;
  const joinedRankingStrings = getJoinedRankingStrings(competingUsers);
  const reveal = {
    color: 0x0099ff,
    title: `It was: ${currentSongTitle}`,
    thumbnail: {
      url: currentSongThumbnail ? currentSongThumbnail : defaultThumbnail,
    },
    description: `__**LEADERBOARD**__ \n\n ${joinedRankingStrings}`,
    footer: {
      text: `Music Quiz - track ${songIndex + 1}/${shuffledSongsInfo.length}`,
    },
  };

  return reveal;
};
