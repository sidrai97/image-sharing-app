import 'source-map-support/register'

import * as uuid from 'uuid'

import { ImageDB } from '../dataLayer/ImageDB'
import { ImageS3 } from '../dataLayer/ImageS3'
import { Tag } from '../models/Tag'
import { Image } from '../models/Image'

import { createLogger } from '../utils/logger'

const logger = createLogger('ImageCRUD')

const imageDB = new ImageDB()
const imageS3 = new ImageS3()

export async function getTags(): Promise<Tag[]> {
  logger.info(`Retrieving all Tags`)
  return await imageDB.getTags()
}

export async function getImages(): Promise<Image[]> {
    logger.info(`Retrieving all Images`)  
    return await imageDB.getImages()
}

export async function getTagsByUserId(userId: string): Promise<Tag[]> {
    logger.info(`Fetch Tags created by UserId: ${userId}`)
    return await imageDB.getTagsByUserId(userId)
}

export async function getImagesByUserId(userId: string): Promise<Image[]> {
    logger.info(`Fetch Images created by UserId: ${userId}`)
    return await imageDB.getImagesByUserId(userId)
}

export async function getImagesByTagId(tagId: string): Promise<Image[]> {
    logger.info(`Fetch Images created under Tag: ${tagId}`)
    return await imageDB.getImagesByTagId(tagId)
}

export async function getImagesByUserTag(userId: string, tagId: string): Promise<Image[]> {
    logger.info(`Fetch Images created By UserId: ${userId} under Tag: ${tagId}`)
    return await imageDB.getImagesByUserTag(userId,tagId)
}

export async function createTag(tagName: string, userId: string): Promise<Tag>{
    const tagId = uuid.v4()
    
    const tagItem : Tag = {
        tagId,
        tagName,
        userId,
        createdAt: new Date().toISOString(),
    }

    logger.info(`Creating Tag: ${tagName} for UserId: ${userId}`)
    await imageDB.createTag(tagItem)

    return tagItem
}

export async function createImage(title: string, userId: string, tagId: string): Promise<Image>{
    const imageId = uuid.v4()
    
    const imageItem : Image = {
        imageId,
        title,
        attachmentURL: null,
        tagId,
        userId,
        createdAt: new Date().toISOString(),
    }

    logger.info(`Creating Image: ${title} for UserId: ${userId} under Tag: ${tagId}`)
    await imageDB.createImage(imageItem)

    return imageItem
}

export async function generateSignedURL(imageId: string): Promise<string>{
    logger.info(`Generate Signed URL for Image: ${imageId}`)
    return await imageS3.getUploadUrl(imageId)
}

export async function updateAttachmentURL(imageId: string, userId: string): Promise<Image> {
    const imageItem: Image = await imageDB.getImageById(userId, imageId)

    if(!imageItem){
        logger.error(`Image not Found with ImageId: ${imageId}`)
        return null
    }

    if(userId != imageItem.userId){
        logger.error(`User: ${userId} not authorized to update Image: ${imageId}`)
        return null
    }

    imageItem.attachmentURL = await imageS3.getAttachmentUrl(imageId)

    logger.info(`Updating Image: ${imageId} with Attachment URL: ${imageItem.attachmentURL}`)
    
    await imageDB.updateAttachmentUrl(imageItem)

    return imageItem
}

export async function deleteImageById(userId: string, imageId: string): Promise<boolean> {
    const imageItem: Image = await imageDB.getImageById(userId, imageId)

    if(!imageItem){
        logger.error(`Image not Found with ImageId: ${imageId}`)
        return false
    }

    if(userId != imageItem.userId){
        logger.error(`User: ${userId} not authorized to update Image: ${imageId}`)
        return false
    }
    
    logger.info(`Deleting Image: ${imageId}`)
    
    await imageDB.deleteImage(imageItem)
    return true
}

export async function updateImage(imageId: string, userId: string, title: string, tagId: string): Promise<Image> {
    const imageItem: Image = await imageDB.getImageById(userId, imageId)

    if(!imageItem){
        logger.error(`Image not Found with ImageId: ${imageId}`)
        return null
    }

    if(userId != imageItem.userId){
        logger.error(`User: ${userId} not authorized to update Image: ${imageId}`)
        return null
    }

    imageItem.title = title
    imageItem.tagId = tagId

    logger.info(`Updating Image: ${imageId} with Title: ${imageItem.title} & TagId: ${imageItem.tagId}`)
    
    await imageDB.updateImage(imageItem)

    return imageItem
}