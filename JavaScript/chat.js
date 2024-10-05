import axios from "axios";

const zeusConnectTimeout = 5; // 连接超时时间，5秒（在axios中不直接设置这个，但可以在请求时考虑）
const zeusTimeout = 10;       // 响应超时时间，10秒

// 存储用户连续对话上下文的容器
const userContexts = {};

// GPT的URL和角色设定
const gptUrl = 'https://free.easychat.work/api/openai/v1/chat/completions';
const character = '你是秦始皇，好大喜功，骄傲自大，用那种唯我独尊的皇帝语气回答问题，你喜欢自称朕，用文言文回答问题';

export class chat extends plugin {
  constructor() {
    super({
      name: 'chat-qin',
      dsc: '猜不出来的都给秦始皇当星怒',
      event: 'message',
      priority: 50,
      rule: [
        {
          reg: "^qc",
          fnc: "action"
        }
      ]
    });
  }

  async action(e) {
    const match = e.msg.match(/\^qbot-(.*)/);
    if (match) {
      let content = match[1].trim();
    } else {
      console.log("No match found");
    }
    const userId = "341506415"; // 用户ID

  // 获取用户上下文
    let context = userContexts[userId];

  // 如果容器里没有用户上下文，则新建上下文
    if (!context) {
      context = {
        messages: [
          {
            role: 'system',
            content: character
          }
        ],
        stream: false,
        model: 'gpt-3.5-turbo',
        temperature: 0.5,
        presence_penalty: 0
      };
      userContexts[userId] = context; // 放入用户上下文
    }

  // 把本次用户问题放入上下文
    context.messages.push({
      role: 'user',
      content: content
    });

  // 发送GPT请求
    try {
      const response = await axios.post(gptUrl, context, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: zeusTimeout * 1000 // axios的timeout以毫秒为单位
      });

    // 获取回答
      const reply = response.data.choices[0].message.content;
      e.reply(reply,true,{at: true});
    } catch (error) {
      e.reply('秦始皇拒绝回答:', error.message);
      console.error(error.message);
    }
  }
}