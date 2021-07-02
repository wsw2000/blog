
// api.getMusicList(705619441)


import React, {
	useEffect
} from 'react';
import api from '../../utils/request'
import {
	loadScript
} from '../../utils'
import './index.less'

const myAplayer = (props) => {
	useEffect(() => {
		loadScript('https://cdn.jsdelivr.net/npm/aplayer@1.10.1/dist/APlayer.min.js', () => {
      api.getMusicList(705619441).then((res) => {
				if (res.data.length == 0) return;

				const ap = new APlayer({
					container: document.getElementById('player'),
					mini: true,
					fixed: true,
					autoplay: false,
					loop: 'all',
					order: 'list',
					preload: 'auto',
					volume: 0.7,
					mutex: true,
					listFolded: true,
					listMaxHeight: 90,
					lrcType: 1,
					audio: res.data,
				});

				ap.lrc.hide() // 隐藏歌词

				// 自适应颜色背景皮肤
				loadScript('https://cdnjs.cloudflare.com/ajax/libs/color-thief/2.3.0/color-thief.min.js', () => {
					const colorThief = new ColorThief();

					const setTheme = (index) => {
						if (!ap.list.audios[index].theme) {
							colorThief.getColorAsync(ap.list.audios[index].cover, function (color) {
								ap.theme(`rgb(${color[0]}, ${color[1]}, ${color[2]})`, index);
							});
						}
					};

					setTheme(ap.list.index);
					ap.on('listswitch', ({
						index
					}) => {
						setTheme(index);
					});
				})
			});
		})
	}, [])

	return (<div id="player"> </div>)
}

export default myAplayer