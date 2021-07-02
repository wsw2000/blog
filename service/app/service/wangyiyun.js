const Service = require('egg').Service;

class Musicervice extends Service {
  async getMusicList(oId) {
    console.log(oId);
    const res1 = await this.ctx.curl(`https://v1.hitokoto.cn/nm/playlist/${oId}`,{
        dataType: 'json',
        method: 'GET',
        data: {},
    })

    if (!res1.data || res1.data.code !== 200) {
        // message.success('歌单id有误或网易云接口出错！')
        return
    }

    let ids = [];
    res1.data && res1.data.privileges && res1.data.privileges.map((item, index) => {
        // 最多20条
        if (index + 1 <= 20) {
            ids.push(item.id);
        }
    });

    const res2 = await this.ctx.curl(`https://v1.hitokoto.cn/nm/summary/${ids.join(',')}`,{
        dataType: 'json',
        method: 'GET',
        data: {
            lyric: true,
            common: true
        }
    })

    var songs = [];
    res2.data && res2.data.songs && res2.data.songs.map(function (song) {
        // 修复有时候第三方的接口失灵导致播放器出错 
        if (song.url[0] !== 'h') {
            song.url = 'https://v1.hitokoto.cn' + song.url
        }
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
  }
}

module.exports = Musicervice;