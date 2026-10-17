import { Injectable, ServiceUnavailableException } from "@nestjs/common";

@Injectable()
export class PointClient{
    private readonly baseUrl = process.env.POINT_BASE_URL;
    private readonly apiKey  = process.env.POINT_API_KEY;

    async request(path: string, method: string, body?: object, reqKey?: string) {
        if (!this.baseUrl || !this.apiKey) throw new ServiceUnavailableException('Point API configuration missing')

        const response = await fetch(`${this.baseUrl}${path}`, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'x-api-key'   : this.apiKey,
                ...(reqKey ? { 'Idempotency-Key': reqKey } : {})
            },
            body  : body ? JSON.stringify(body) : undefined,
            signal: AbortSignal.timeout(5000)
        });

        const result    = await response.json()
        if (!response.ok) throw new Error(`Point API returned ${response.status}: ${JSON.stringify(result)}`)
        return result
    }
}