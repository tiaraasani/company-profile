import { request } from '@/lib/backendless'

export interface InquiryInput {
  subject: string
  name: string
  company: string
  email: string
  phone: string
  country: string
  message: string
}

export interface InquiryRecord extends InquiryInput {
  objectId: string
  source: string
  created?: number
}

/**
 * POST /data/Inquiries. The table is created by the first submission (dynamic schema);
 * its permission must allow Create for anonymous visitors and nothing else, see README.
 */
export function createInquiry(input: InquiryInput, signal?: AbortSignal): Promise<InquiryRecord> {
  return request<InquiryRecord>('/data/Inquiries', {
    method: 'POST',
    body: { ...input, source: 'company-profile' },
    withAuth: false,
    signal,
  })
}
