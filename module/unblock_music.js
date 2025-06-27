// module/test.js
const { unblockMusic } = require('@unblockneteasemusic/server');

// 默认支持的平台
const DEFAULT_PLATFORMS = ['qq', 'kugou', 'kuwo', 'youtube', 'bilibili'];

module.exports = async (query, request) => {
  try {
    // 合并 GET 和 POST 参数
    const params = {
      ...query,
      ...(query.body || {})
    };
    
    const { id, br = 999000, platforms, raw = false } = params;
    
    // 参数验证
    if (!id) {
      return {
        status: 400,
        body: {
          code: 400,
          msg: 'Missing required parameter: id'
        }
      };
    }

    // 处理平台参数
    let platformList = DEFAULT_PLATFORMS;
    if (platforms) {
      platformList = typeof platforms === 'string' 
        ? platforms.split(',') 
        : platforms;
    }

    // 处理歌曲数据
    let songData;
    if (params.songData) {
      songData = typeof params.songData === 'string' 
        ? JSON.parse(params.songData) 
        : params.songData;
    }

    // 调用解锁功能
    const result = await unblockMusic(id, songData, platformList);

    // 是否返回原始数据
    if (raw) {
      return {
        status: 200,
        body: result.data
      };
    }

    // 标准响应格式
    return {
      status: 200,
      body: {
        code: 200,
        data: {
          ...result.data,
          br: parseInt(br, 10),
          timestamp: Date.now()
        }
      },
      cookie: []
    };
  } catch (error) {
    return {
      status: 500,
      body: {
        code: 500,
        msg: error.message,
        ...(process.env.NODE_ENV === 'development' && {
          stack: error.stack
        })
      }
    };
  }
};
