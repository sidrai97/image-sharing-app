import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getUserId } from '../../auth/utils'
import { getImagesByUserTag } from '../../businessLogic/ImageCRUD'
import { createLogger } from '../../utils/logger'

const logger = createLogger('getImagesByUserTag')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  logger.info('Processing getImagesByUserTag event', { event })

  const userId = getUserId(event)
  const tagId = event.pathParameters.tagId
  const items = await getImagesByUserTag(userId, tagId)

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
