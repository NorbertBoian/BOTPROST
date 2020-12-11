import { defaultThumbnail } from "../quizExports";
import { getJoinedRankingStrings } from "./getJoinedRankingStrings";

export const getRevealEmbedObject = (
  shuffledSongsInfo,
  songIndex,
  competingUsers,
  totalSongs
) => {
  const currentSong = shuffledSongsInfo[songIndex];
  // console.log(currentSong, songIndex, shuffledSongsInfo);
  const featuredArtists = currentSong.artistsNames.slice(1);
  const mainArtist = currentSong.artistsNames[0];
  const currentArtists = `${mainArtist}${
    featuredArtists.length ? ` feat. ${featuredArtists.join(" , ")}` : ""
  }`;
  const currentSongName = currentSong.songName;
  const currentSongTitle = `${currentArtists} - ${currentSongName}`;
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
      text: `Music Quiz - track ${songIndex + 1}/${totalSongs}`,
    },
  };

  return reveal;
};
