import 'source-map-support/register'

import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

import { createLogger } from '../utils/logger'

const logger = createLogger('ImageS3')

const XAWS = AWSXRay.captureAWS(AWS)

export class ImageS3 {

    constructor(
        private readonly s3 = new XAWS.S3({ signatureVersion: 'v4' }),
        private readonly bucketName = process.env.ATTACHMENTS_S3_BUCKET,
        private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION
    ) { }

    async getAttachmentUrl(attachmentId: string): Promise<string> {
        logger.info(`Get S3 Attachement URL for ${attachmentId}`)
        const attachmentUrl = `https://${this.bucketName}.s3.amazonaws.com/${attachmentId}`
        return attachmentUrl
    }

    async getUploadUrl(attachmentId: string): Promise<string> {
        logger.info(`Get S3 Signed URL for ${attachmentId}`)
        const uploadUrl = this.s3.getSignedUrl('putObject', {
            Bucket: this.bucketName,
            Key: attachmentId,
            Expires: parseInt(this.urlExpiration)
        })
        return uploadUrl
    }

}