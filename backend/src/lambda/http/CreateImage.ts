import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateImageRequest } from '../../requests/CreateImageRequest'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../../auth/utils'
import { createImage, generateSignedURL, updateAttachmentURL } from '../../businessLogic/ImageCRUD'

const logger = createLogger('createImage')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  logger.info('Processing createImage event', { event })
  
  const userId = getUserId(event)
  const newImage: CreateImageRequest = JSON.parse(event.body)

  const newItem = await createImage(newImage.title, userId, newImage.tagId)

  const signedURL = await generateSignedURL(newItem.imageId)

  await updateAttachmentURL(newItem.imageId, userId)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item: newItem,
      signedURL
    })
  }
}
