import 'source-map-support/register'

import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import * as AWSXRay from 'aws-xray-sdk'

import { createLogger } from '../utils/logger'
import { Tag } from '../models/Tag'
import { Image } from '../models/Image'

const logger = createLogger('ImageDB')

const XAWS = AWSXRay.captureAWS(AWS)

export class TodoDB {

  constructor(
    private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
    private readonly tagTable = process.env.TAG_TABLE,
    private readonly imageTable = process.env.IMAGE_TABLE,
    private readonly imagesByTagIndex = process.env.IMAGES_BY_TAG_INDEX,
    private readonly imageIdIndex = process.env.IMAGES_ID_INDEX
  ) {}

  async getTagsByUserId(userId: string): Promise<Tag[]> {
    const result = await this.docClient.query({
      TableName: this.tagTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      },
      ScanIndexForward: false
    }).promise()

    const item = result.Items
    return item as Tag[]
  }

  async getTags(): Promise<Tag[]> {
    const result = await this.docClient.query({
      TableName: this.tagTable
    }).promise()

    const item = result.Items
    return item as Tag[]
  }

  async getImageByTagId(tagId: string): Promise<Image[]>{
    const result = await this.docClient.query({
      TableName: this.imageTable,
      IndexName : this.imagesByTagIndex,
      KeyConditionExpression: 'tagId = :tagId',
      ExpressionAttributeValues: {
        ':tagId': tagId
      }
    }).promise()

    const item = result.Items
    return item as Image[]
  }

  async getImagesByUserId(userId: string): Promise<Image[]>{
    const result = await this.docClient.query({
      TableName: this.imageTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      },
      ScanIndexForward: false
    }).promise()

    const item = result.Items
    return item as Image[]
  }

  async getImageById(imageId: string): Promise<Image>{
    const result = await this.docClient.query({
      TableName: this.imageTable,
      IndexName : this.imageIdIndex,
      KeyConditionExpression: 'imageId = :imageId',
      ExpressionAttributeValues: {
          ':imageId': imageId
      }
    }).promise()

    const item = result.Items[0]
    return item as Image
  }
}