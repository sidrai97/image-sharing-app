import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateTagRequest } from '../../requests/CreateTagRequest'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../../auth/utils'
import { createTag } from '../../businessLogic/ImageCRUD'

const logger = createLogger('createTag')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  logger.info('Processing createTag event', { event })
  
  const userId = getUserId(event)
  const newTag: CreateTagRequest = JSON.parse(event.body)

  const newItem = await createTag(newTag.tagName, userId)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item: newItem
    })
  }
}
