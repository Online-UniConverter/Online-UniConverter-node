import FormData, { type Stream } from 'form-data';
import OnlineUniConverter from './OnlineUniConverter';
import { type JobTask } from './JobsResource';
import axios from 'axios';

export type TaskEvent = 'created' | 'updated' | 'finished' | 'failed';
export type TaskStatus = 'waiting' | 'processing' | 'finished' | 'error';

export interface TaskEventData {
    task: Task;
}

export type Operation = ImportOperation | TaskOperation | ExportOperation;
export type ImportOperation =
    | ImportUrl
    | ImportUpload
    | ImportBase64;
export type TaskOperation =
    | TaskConvert
    | TaskCompress;
export type ExportOperation =
    | ExportUrl;

interface ImportUrl {
    operation: 'import/url';
    data: ImportUrlData;
}

export interface ImportUrlData {
    url: string;
    file_name?: string;
    headers?: { [key: string]: string };
}

interface ImportUpload {
    operation: 'import/upload';
    data: ImportUploadData;
}

export interface ImportUploadData {
    redirect?: string;
}

interface ImportBase64 {
    operation: 'import/base64';
    data: ImportBase64Data;
}

export interface ImportBase64Data {
    content: string;
    file_name: string;
}

interface TaskConvert {
    operation: 'convert';
    data: TaskConvertData;
}


export interface TaskConvertData {
    input: string | string[];
    input_format?: string;
    output_format: string;
    engine?: string;
    engine_version?: string;
    filename?: string;
    timeout?: number;
    video_params?:any;
    audio_params?:any;
    [option: string]: any;
    
}
interface TaskCompress {
  operation: 'compress';
  data: TaskCompressData;
}
export interface TaskCompressData {
  input: string | string[];
  input_format?: string;
  output_format: string;
  ratio?: string;
  resolution?: string;
  bitrate?: string;
  filename?: string;
  timeout?: number;

  [option: string]: any;
}

interface ExportUrl {
    operation: 'export/url';
    data: ExportUrlData;
}

export interface ExportUrlData {
    input: string | string[];
    inline?: boolean;
    archive_multiple_files?: boolean;
}

export interface Task {
    id: string;
    job_id: string;
    operation: Operation['operation'];
    status: TaskStatus;
    message: string | null;
    code: string | null;
    credits: number | null;
    created_at: string;
    started_at: string | null;
    ended_at: string | null;
    depends_on_tasks: { [task: string]: string };
    retry_of_task_id?: string | null;
    retries?: string[] | null;
    engine: string;
    engine_version: string;
    payload: any;
    result?: { files?: FileResult[]; [key: string]: any };
}

export interface FileResult {
    dir?: string;
    filename: string;
    url?: string;
}

export default class TasksResource {
    private readonly OnlineUniConverter: OnlineUniConverter;

    constructor(OnlineUniConverter: OnlineUniConverter) {
        this.OnlineUniConverter = OnlineUniConverter;
    }

    async get(
        id: string,
        query: { include: string } | null = null
    ): Promise<Task> {
        const response = await this.OnlineUniConverter.axios.get(`tasks/${id}`, {
            params: query || {}
        });
        return response.data.data;
    }

    async wait(id: string): Promise<Task> {
        const response = await this.OnlineUniConverter.axios.get(`tasks/${id}`);
        return response.data.data;
    }

    // async cancel(id: string): Promise<Task> {
    //     const response = await this.OnlineUniConverter.axios.post(
    //         `tasks/${id}/cancel`
    //     );
    //     return response.data.data;
    // }

    async all(
        query: {
            'filter[job_id]'?: string;
            'filter[status]'?: TaskStatus;
            'filter[operation]'?: Operation['operation'];
            per_page?: number;
            page?: number;
        } | null = null
    ): Promise<Task[]> {
        const response = await this.OnlineUniConverter.axios.get('tasks', {
            params: query || {}
        });
        return response.data.data;
    }

    async create<O extends Operation['operation']>(
        operation: O,
        data: Extract<Operation, { operation: O }>['data'] | null = null
    ): Promise<Task> {
        const response = await this.OnlineUniConverter.axios.post<any>(
            operation,
            data
        );
        return response.data.data;
    }

    async delete(id: string): Promise<void> {
        await this.OnlineUniConverter.axios.delete(`tasks/${id}`);
    }

    async upload(
        task: Task | JobTask,
        stream: Stream,
        filename: string | null = null
    ): Promise<any> {
        if (task.operation !== 'import/upload') {
            throw new Error('The task operation is not import/upload');
        }

        if (task.status !== 'waiting' || !task.result || !task.result.form) {
            throw new Error('The task is not ready for uploading');
        }

        const formData = new FormData();

        for (const parameter in task.result.form.parameters) {
            formData.append(parameter, task.result.form.parameters[parameter]);
        }

        let fileOptions = {};
        if (filename) {
            fileOptions = { filename };
        }
        formData.append('file', stream, fileOptions);

        return await axios.post(task.result.form.url, formData, {
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
            headers: {
                ...formData.getHeaders()
            }
        });
    }

    // async subscribeEvent(
    //     id: string,
    //     event: TaskEvent,
    //     callback: (event: TaskEventData) => void
    // ): Promise<void> {
    //     this.OnlineUniConverter.subscribe(
    //         `private-task.${id}`,
    //         `task.${event}`,
    //         callback
    //     );
    // }
}
