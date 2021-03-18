import 'source-map-support/register'

import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import * as AWSXRay from 'aws-xray-sdk'

import { createLogger } from '../utils/logger'
import { Tag } from '../models/Tag'
import { Image } from '../models/Image'

const logger = createLogger('ImageDB')

const XAWS = AWSXRay.captureAWS(AWS)

export class ImageDB {

  constructor(
    private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
    private readonly tagTable = process.env.TAG_TABLE,
    private readonly imageTable = process.env.IMAGE_TABLE,
    private readonly imagesByTagIndex = process.env.IMAGES_BY_TAG_INDEX,
  ) {}

  async getTagsByUserId(userId: string): Promise<Tag[]> {
    logger.info(`Get Tags by UserId: ${userId}`)

    const result = await this.docClient.query({
      TableName: this.tagTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      },
      ScanIndexForward: false
    }).promise()

    const items = result.Items
    return items as Tag[]
  }

  async getTagById(userId: string,tagId: string): Promise<Tag> {
    logger.info(`Get Tag by Id: ${tagId}`)

    const result = await this.docClient.get({
      TableName: this.tagTable,
      Key: {
        userId,
        tagId
      }
    }).promise()

    const item = result.Item
    return item as Tag
  }

  async getTags(): Promise<Tag[]> {
    logger.info(`Get all Tags`)

    const result = await this.docClient.query({
      TableName: this.tagTable
    }).promise()

    const items = result.Items
    return items as Tag[]
  }

  async createTag(item: Tag){
    logger.info(`Create Tag by Id: ${item.tagId}`)

    await this.docClient.put({
      TableName: this.tagTable,
      Item: item
    }).promise()
  }

  async createImage(item: Image){
    logger.info(`Create Image by Id: ${item.tagId}`)

    await this.docClient.put({
      TableName: this.imageTable,
      Item: item
    }).promise()
  }

  async getImages(): Promise<Image[]> {
    logger.info(`Get all Images`)

    const result = await this.docClient.query({
      TableName: this.imageTable
    }).promise()

    const items = result.Items
    return items as Image[]
  }

  async getImagesByTagId(tagId: string): Promise<Image[]>{
    logger.info(`Get Image by Tag Id: ${tagId}`)

    const result = await this.docClient.query({
      TableName: this.imageTable,
      IndexName : this.imagesByTagIndex,
      KeyConditionExpression: 'tagId = :tagId',
      ExpressionAttributeValues: {
        ':tagId': tagId
      }
    }).promise()

    const items = result.Items
    return items as Image[]
  }

  async getImagesByUserId(userId: string): Promise<Image[]>{
    logger.info(`Get Image by User Id: ${userId}`)

    const result = await this.docClient.query({
      TableName: this.imageTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      },
      ScanIndexForward: false
    }).promise()

    const items = result.Items
    return items as Image[]
  }

  async getImageById(userId: string, imageId: string): Promise<Image>{
    logger.info(`Get Image by Id: ${imageId}`)

    const result = await this.docClient.get({
      TableName: this.imageTable,
      Key: {
        userId,
        imageId
      }
    }).promise()

    const item = result.Item
    return item as Image
  }

  async getImagesByUserIdTagId(userId: string, tagId: string): Promise<Image[]>{
    logger.info(`Get Images by UserId: ${userId} and TagId: ${tagId}`)

    const result = await this.docClient.query({
      TableName: this.imageTable,
      KeyConditionExpression: 'userId = :userId, tagId = : tagId',
      ExpressionAttributeValues: {
        ':userId': userId,
        ':tagId': tagId
      },
      ScanIndexForward: false
    }).promise()

    const items = result.Items
    return items as Image[]
  }

  async updateAttachmentUrl(imageItem: Image) {
    logger.info(`Updating attachment URL for todo ${imageItem.imageId} in ${this.imageTable}`)

    const userId = imageItem.userId
    const imageId = imageItem.imageId

    await this.docClient.update({
      TableName: this.imageTable,
      Key: {
        userId,
        imageId
      },
      UpdateExpression: 'set attachmentURL = :attachmentURL',
      ExpressionAttributeValues: {
        ':attachmentURL': imageItem.attachmentURL
      }
    }).promise()
  }

  async deleteImage(imageItem: Image) {
    logger.info(`Deleting todo item ${imageItem.imageId} from ${this.imageTable}`)

    const userId = imageItem.userId
    const imageId = imageItem.imageId

    await this.docClient.delete({
      TableName: this.imageTable,
      Key: {
        userId,
        imageId
      }
    }).promise()    
  }

  async updateImage(imageItem: Image) {
    logger.info(`Updating Image ${imageItem.imageId} in ${this.imageTable}`)

    const userId = imageItem.userId
    const imageId = imageItem.imageId

    await this.docClient.update({
      TableName: this.imageTable,
      Key: {
        userId,
        imageId
      },
      UpdateExpression: 'set title = :title, tagId = :tagId',
      ExpressionAttributeValues: {
        ':title': imageItem.title,
        ':tagId': imageItem.tagId
      }
    }).promise()
  }
}