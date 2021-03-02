import React, { useEffect, useState } from 'react'
import Aplayer from 'aplayer'
import Axios from 'axios';
import 'aplayer/dist/APlayer.min.css';
import './index.less';
export default function MyAplayer() {

  const fetch163Playlist = (playlistId) => {
    return new Promise((ok, err) => {
      Axios.get(`https://v1.hitokoto.cn/nm/playlist/${playlistId}`)
        .then(data => {
          let arr = [];
          data.data.privileges.map(function (value) {
            arr.push(value.id);
          });
          return arr;
        })
        .then((arr) => {
          let list = fetch163Songs(arr)
          ok(list)
        })
        .catch(err);
    });
  }


  const fetch163Songs = (Ids) => {
    return new Promise(function (ok, err) {
      let ids;
      switch (typeof Ids) {
        case 'number':
          ids = [Ids];
          break;
        case 'object':
          if (!Array.isArray(Ids)) {
            err(new Error('Please enter array or number'));
            return;
          }
          ids = Ids;
          break;
        default:
          err(new Error('Please enter array or number'));
          return;
          break;
      }
      Axios.get(`https://v1.hitokoto.cn/nm/summary/${ids.slice(0, 50).join(',')}?lyric=true&common=true`)
        .then(data => {
          var songs = [];
          data.data.songs.map(function (song) {
            songs.push({
              name: song.name,
              url: song.url,
              artist: song.artists.join('/'),
              album: song.album.name,
              pic: song.album.picture,
              lrc: song.lyric.translate || song.lyric.base
            });
          });
          return songs;
        })
        .then(ok)
        .catch(err);
    });
  }

  useEffect(() => {
    fetch163Playlist(2416836474).then((data) => {
      const ap = new Aplayer({
        container: document.getElementById('player'),
        mini: true,
        fixed: true,
        autoplay: false,
        loop: 'all',
        order: 'list',
        preload: 'auto',
        volume: 0.7,
        mutex: true,
        listFolded: false,
        listMaxHeight: 5,
        lrcType: 1,
        audio: data
      });
      ap.lrc.hide()  // 隐藏歌词
    })
  }, [])

  return (
    <div id="player"></div>
  )
}