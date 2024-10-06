import fetch from 'node-fetch';


const sx = '你是秦始皇，好大喜功，骄傲自大，用那种唯我独尊的皇帝语气回答问题，你喜欢自称朕，用文言文回答问题'

//获取的密钥填在这

const key = `iZYlCIht53SjDKcHIZBeO4t6lA`;


//TRSS-Yunzai 日期8.7 实测可用，用不了的自己找找什么问题

export class ChatGPTAPI extends plugin {
	constructor() {
		super({
			name: 'qingpt',
			dsc: '调用gpt接口',
			event: 'message',
			priority: 50,
			rule: [{
				reg: `^qinbot1-(.*)$`,
				fnc: 'chatgpt4'
			}]
		})
	}
	
	async chatgpt4(e) {
		let msg = e.msg.replace(/^qinbot1-/,'')
		let api = `https://apii.lolimi.cn/api/4o/gpt4o?sx=${sx}&msg=${msg}&key=${key}`
		let res = await fetch(api)
		res = await res.json()
		if(!res) res = '无返回值，过一会再试试'
		if(res.code != 200) res = 'api出错，等待修复即可'
		if(!res.data.content) res='出错，原因未知'
		res = res.data.content;
		return e.reply(res,true,{at: true})
	}
}