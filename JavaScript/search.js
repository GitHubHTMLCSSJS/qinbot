export class search extends plugin {
  constructor() {
    super({
      name: 'search',
      dsc: 'bbaike&quark',
      event: 'message',
      priority: 50,
      rule: [
        {
          reg: "^q-bk(.*?)",
          fnc: "baike"
        }
      ]
    });
  }

  async baike(e) {
    const baikeRegex = /^q-bk(.*?)/;
// 提取百科查询关键词并调用API
    const baikeMatch = e.msg.match(baikeRegex);
    if (baikeMatch && baikeMatch[1]) {
      const baikeKeyword = baikeMatch[1];
      try {
        const response = await axios.get('http://api.ocoa.cn/api/bk.php', {
          params: {
            msg: baikeKeyword,
            type: 'text'
          }
        });
        e.reply(response.data);
      } catch (error) {
        console.error('百科查询出错:', error.message);
        e.reply(error.message);
      }
    }
  }
}