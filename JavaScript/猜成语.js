import plugin from "../../lib/plugins/plugin.js";
import axios from "axios";
import common from "../../lib/common/common.js";

let key = {}
let zuo = false
let thime;
let setime;

export class ccy extends plugin {
  constructor() {
    super({
      name: "猜成语",
      dsc: "猜不出来的都给秦始皇当星怒",
      event: "message",
      priority: 5000,
      rule: [
        {
          reg: "^q-猜成语$",
          fnc: "chengyu"
        },
        {
          reg: "^q-设置",
          fnc: "setting"
        },
        {
          reg: "^q-c",
          fnc: "doRep"
        },
        {
          reg: "^q-菜单$",
          fnc: "menu"
        }
      ]
    });
  }
  
  async chengyu(e) {
    if (!zuo) {
      try {
        const response = await axios.get("https://free.wqwlkj.cn/wqwlapi/ccy.php");  
        const data = response.data;
        const answer = data.answer;
        const img = data.img;
        await e.reply([segment.image(img)]);
        await e.reply("请在1分钟之内猜出图片所对应的成语，猜中发送q-c即可，如 q-c大秦帝国 ");
        zuo = true;
        key[e.userid] = {
          ans: answer,
          img: img
        };
        thime = Date.now();
        setime = setTimeout(() => {
            if (zuo) {
              var an = key[e.userid].ans;
              e.reply("时间到，答案是：",an);
              e.reply("拜托，你很弱诶。");
              e.reply("快去给秦始皇当星怒吧");
              logger.info("------（-＾〇＾-）-----");
              logger.info("发现一名秦始皇的星怒");
              zuo = false;
              delete key[e.userid];
            }
          },60000);
        this.setContext("doRep");
      } catch (error) {
        await e.reply("获取成语数据时出错:", error);
        logger.info("猜成语插件连接失败");
        console.error(error.message);
        return true;
      }
    }
    else{
      await e.reply("成语都还没猜完呢，别想赖账!");
    }
  }
  async doRep(e) {
  e = this.e;
    if (zuo) {
      const match = e.msg.match(/^q-c(.*)/);
      if (match) {
        if (match[1].trim() == key[e.userid].ans) {
          let msg = "答对了";
          e.reply(msg,true,{at: true});
          zuo = false;
          delete key[e.userid];
          clearTimeout(setime);
          return true;
        }
        else{
          let zuotime = Math.floor((Date.now() - thime) / 1000); 
          let detime = 60 - zuotime;
          let msg = "答错了，你还剩" + detime + "秒"
          e.reply(msg,true,{at: true});
        }
      }
    }
  }
  
  async setting(e) {
    if (!e.isMaster) {
      await e.reply("暂无权限，只有主人、群主或管理员才能操作");
      logger.info("有人要谋权篡位⌓‿⌓");
      return false;
    }
    else {
      await e.reply("主人你好呀，欢迎回来。");
      return false;
    }
    return true;
  }
  
  async menu(e) {
    let menu = "q-猜成语 q-设置\n现在只有这两个功能。";
    await e.reply(menu,true);
    await e.reply([segment.image("http://tool.qinbot.us.kg/imgs/qinb.jpg")]);
    return true;
  }
}