import { Injectable, ServiceUnavailableException } from "@nestjs/common";

export class PointApiError extends Error {
    constructor(
        public readonly status: number,
        public readonly data  : unknown
    ) {
        super(`Point API returned ${status}`)
    }
}

@Injectable()
export class PointClient{
    private readonly baseUrl = process.env.POINT_BASE_URL;
    private readonly apiKey  = process.env.POINT_API_KEY;

    async findWallet(userId: string) {
        try {
            return await this.request(`/wallets/${userId}`, 'GET')
        } catch (error) {
            if (!(error instanceof PointApiError) || error.status !== 404) throw error
        }

        try {
            return await this.request('/wallets', 'POST', { user_id: userId })
        } catch (error) {
            if (!(error instanceof PointApiError) || error.status !== 409) throw error
            return this.request(`/wallets/${userId}`, 'GET')
        }
    }

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
        if (!response.ok) throw new PointApiError(response.status, result)
        return result
    }
}
