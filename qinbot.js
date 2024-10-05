export class qinbot extends plugin {
    constructor() {
        super({
            name: 'qinbot',
            dsc: '群助手v2.0',
            event: 'message',
            priority: 2000,
            rule: [
                {
                    reg: '^meMenu$',
                    fnc: 'menu'
                }
            ]
        });
    }
    
    async menu(e){
        let message = '';
        messge+='群助手v2.0\n';
        message+='菜单还没做好呢。';
        e.reply(message);
        return;
    }
}
