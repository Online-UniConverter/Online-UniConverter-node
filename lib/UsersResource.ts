import OnlineUniConverter from './OnlineUniConverter';
import { type JobEvent, type JobEventData } from './JobsResource';
import { type TaskEvent, type TaskEventData } from './TasksResource';

export interface User {
    id: string;
    username: string;
    email: string;
    credits: number;
    created_at: string;
}

export default class UsersResource {
    private readonly OnlineUniConverter: OnlineUniConverter;

    constructor(OnlineUniConverter: OnlineUniConverter) {
        this.OnlineUniConverter = OnlineUniConverter;
    }

    async me(): Promise<User> {
        const response = await this.OnlineUniConverter.axios.get('/me');
        return response.data.data;
    }

    // async subscribeJobEvent(
    //     id: string,
    //     event: JobEvent,
    //     callback: (event: JobEventData) => void
    // ): Promise<void> {
    //     this.OnlineUniConverter.subscribe(
    //         `private-user.${id}.jobs`,
    //         `job.${event}`,
    //         callback
    //     );
    // }

    // async subscribeTaskEvent(
    //     id: string,
    //     event: TaskEvent,
    //     callback: (event: TaskEventData) => void
    // ): Promise<void> {
    //     this.OnlineUniConverter.subscribe(
    //         `private-user.${id}.tasks`,
    //         `task.${event}`,
    //         callback
    //     );
    // }
}
