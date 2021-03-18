import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getUserId } from '../../auth/utils'
import { getImagesByUserIdTagId } from '../../businessLogic/ImageCRUD'
import { createLogger } from '../../utils/logger'

const logger = createLogger('getImagesByUserIdTagId')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  logger.info('Processing getImagesByUserIdTagId event', { event })

  const userId = getUserId(event)
  const tagId = event.pathParameters.tagId
  const items = await getImagesByUserIdTagId(userId, tagId)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      items
    })
  }
}
