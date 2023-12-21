

export interface HttpAdepter {
    get<T>(url: string): Promise<T>
}