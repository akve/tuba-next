class MessageResponseDto {
    public isInfo: boolean = true;
    public status: 'error' | 'info' | 'success';
    public title: string;
    public text: string;
    public fields: any;

    constructor(status: 'error' | 'info' | 'success', title: string, text: string, fields: any = {}) {
        this.status = status;
        this.title = title;
        this.text = text;
        this.fields = fields;
    }
}

export { MessageResponseDto };
