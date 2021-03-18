import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getUserId } from '../../auth/utils'
import { getImagesByTagId } from '../../businessLogic/ImageCRUD'
import { createLogger } from '../../utils/logger'

const logger = createLogger('getImagesByTagId')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  logger.info('Processing getImagesByTagId event', { event })

  const userId = getUserId(event)
  const tagId = event.pathParameters.tagId
  const items = await getImagesByTagId(tagId)

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
