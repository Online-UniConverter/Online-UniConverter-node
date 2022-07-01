import axios, { type AxiosInstance } from 'axios';
// import io from 'socket.io-client';
import JobsResource, { type JobEventData } from './JobsResource';
import TasksResource, { type TaskEventData } from './TasksResource';
import UsersResource from './UsersResource';
import WebhooksResource from './WebhooksResource';
import { version } from '../package.json';
import SignedUrlResource from './SignedUrlResource';

export default class OnlineUniConverter {
    // private socket: SocketIOClient.Socket | undefined;
    // private subscribedChannels: Map<string, boolean> | undefined;

    public readonly apiKey: string;
    public readonly useSandbox: boolean;

    public axios!: AxiosInstance;
    public tasks!: TasksResource;
    public jobs!: JobsResource;
    public users!: UsersResource;
    public webhooks!: WebhooksResource;
    public signedUrls!: SignedUrlResource;

    constructor(apiKey: string, useSandbox = false) {
        this.apiKey = apiKey;
        this.useSandbox = useSandbox;

        this.createAxiosInstance();
        this.createResources();
    }

    createAxiosInstance(): void {
        this.axios = axios.create({
            baseURL:'https://api.media.io/v2/',
            headers: {
                Authorization: `Bearer ${this.apiKey}`,
                'User-Agent': `OnlineUniConverter-node/v${version} (https://github.com/OnlineUniConverter/OnlineUniConverter-node)`
            }
        });
    }

    createResources(): void {
        this.tasks = new TasksResource(this);
        this.jobs = new JobsResource(this);
        this.users = new UsersResource(this);
        this.webhooks = new WebhooksResource();
        this.signedUrls = new SignedUrlResource();
    }

    // subscribe(
    //     channel: string,
    //     event: string,
    //     callback:
    //         | ((event: JobEventData) => void)
    //         | ((event: TaskEventData) => void)
    // ): void {
    //     if (!this.socket) {
    //         this.socket = io.connect(
    //             this.useSandbox
    //                 ? 'https://socketio.sandbox.OnlineUniConverter.com'
    //                 : 'https://socketio.OnlineUniConverter.com',
    //             {
    //                 transports: ['websocket']
    //             }
    //         );
    //         this.subscribedChannels = new Map<string, boolean>();
    //     }

    //     if (!this.subscribedChannels?.get(channel)) {
    //         this.socket.emit('subscribe', {
    //             channel,
    //             auth: {
    //                 headers: {
    //                     Authorization: `Bearer ${this.apiKey}`
    //                 }
    //             }
    //         });
    //         this.subscribedChannels?.set(channel, true);
    //     }

    //     this.socket.on(
    //         event,
    //         function (eventChannel: string, eventData: any): void {
    //             if (channel !== eventChannel) {
    //                 return;
    //             }
    //             callback(eventData);
    //         }
    //     );
    // }

    // closeSocket(): void {
    //     this.socket?.close();
    // }
}
