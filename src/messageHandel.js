import emojis from './common/emojis';
const handelMessage = function ( content ) {
	 content = content.replace(/\n/g, '&lbrg')
  .replace(/\t/g, ' ');
   //转义换行
	return content;
}
export const reverse = function ( content, mesages_types ) {
  if ( !content ) {
    return ;
  };
  // console.log(content);return false;
	content = content.replace(/&lbrg/g, '<br>')
  	.replace(/(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)[^\]]/g, function (y, u) {
      if ( y.indexOf('http://omso2o.com') != -1 ) {
        return y;
      }
      if ( content.indexOf('-liveVideo-[') != -1 ) {
        return y;
      }
      // if ( y.indexOf('7xq4o9') != -1 ) {
      //   return y;
      // }
      let a = '<a href="'+y+'" target="_blank">'+y+'</a>';
      return a;
    })
   //  转义换行
	// .replace(/face\[([^\s\[\]]+?)\]/g, function(face){  //转义表情
 //      var alt = face.replace(/^face/g, '');
 //      return '<img alt="'+ alt +'" title="'+ alt +'" src="' + faces[alt] + '">';
 //    })
    .replace(/【(.*?)】/g, function ( f, v ) {
      let em = emojis.find(em => {
          return em.name == v;
      });
      if ( !em ) {
        return f;
      }
      let img = '<img width="20px"  src="https://www.omso2o.com/chatStatic/emoji/'+em.num+'@2x.png" alt="'+em.name+'" />'
      return img;
    })
    .replace(/\[(.*?)\]/g, function ( f, v ) {
      let em = emojis.find(em => {
          return em.name == v;
      });
      if ( !em ) {
        return f;
      }
      let img = '<img width="20px"  src="https://www.omso2o.com/chatStatic/emoji/'+em.num+'@2x.png" alt="'+em.name+'" />'
      return img;
    })
    .replace(/-(file|img|video)-\[(.*?)\]$/g, function (f, i, z) {
      let m = '';
      let zArr = z.split('|');

      if ( z[1] ) {
        if ( zArr[0].indexOf('MOV') !== -1 ) {
            zArr[1] = zArr[1] + '?attname=' + zArr[0].replace('MOV', 'mp4');
        }
			zArr[1].replace(/http\:\/\/7xq4o9\.com1\.z0\.glb\.clouddn\.com/, 'http://omso2o.com');
        if ( i == 'img' ) {
            m = '<img style="max-width: 200px;" data-type="'+mesages_types+'" class="chat-img" src="'+zArr[1]+'" alt="'+zArr[0]+'" />';
        } else if ( i == 'file' ) {
          m = '<div class="chat-file" style="-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;"><share class="iconfont-chat chat-share" data-type="'+mesages_types+'" data-content="'+f+'">&#xe6cb;</share><a title="'+zArr[0]+'" href="'+zArr[1]+'" download target="_blank"><i class="iconfont-chat">&#xe662;</i><p title="'+zArr[0]+'">'+zArr[0]+'</p></a></div>';
        } else if ( i == 'video' ) {
           m =  '<video controls="controls" style="width: 200px; height: 200px" src="' +zArr[1] + '"></video>';
        }
      };
      return m;
    })
    .replace(/-(liveVideo)-\[(.*?)\]$/g, function (f, i, z) {
      let m = '';
      if ( z ) {
        m = '<span>视频邀请：</span><a class="chat-live-video" href="'+z+'">点击加入...</a>';

      };
      return m;
    });

    return content;
}
export default handelMessage;
